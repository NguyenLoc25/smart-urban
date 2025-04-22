import { db } from "@/lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

// Configuration
const VALID_ENERGY_TYPES = ['solar', 'wind', 'hydro'];
const ENERGY_BASE_PATH = "energy/renewable/hour";

// Helper Functions
const isValidEnergyType = (type) => {
  return VALID_ENERGY_TYPES.includes(type.toLowerCase());
};

const validateRequestData = (data) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, missingFields: ['all'] };
  }
  
  // For array input (multiple hours)
  if (Array.isArray(data)) {
    const invalidItems = data.filter(item => !item.Hour);
    if (invalidItems.length > 0) {
      return { valid: false, missingFields: ['Hour in some items'] };
    }
    return { valid: true };
  }
  
  // For single hour input
  const requiredFields = ['Electricity', 'Entity', 'Hour', 'Month', 'Year'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  return {
    valid: missingFields.length === 0,
    missingFields: missingFields.length > 0 ? missingFields : undefined
  };
};

const findExistingRecord = async (energyType, data) => {
  const energyField = `Electricity from ${energyType} - TWh`;
  const snapshot = await db.ref(ENERGY_BASE_PATH).orderByChild('Hour').equalTo(data.Hour).once('value');
  
  if (snapshot.exists()) {
    const records = snapshot.val();
    for (const [key, record] of Object.entries(records)) {
      if (
        record.Entity === data.Entity &&
        record.Hour === data.Hour &&
        record.Month === data.Month &&
        record.Year === data.Year &&
        record[energyField] === data.Electricity
      ) {
        return { exists: true, id: key, record };
      }
    }
  }
  return { exists: false };
};

// Main POST Handler
export async function POST(request, { params }) {
  try {
    // No need to await params - they're available synchronously
    const { type } = params; // This line is correct as is
    const energyType = type.toLowerCase();

    // Validate energy type
    if (!isValidEnergyType(energyType)) {
      return NextResponse.json(
        { error: `Invalid energy type. Valid types are: ${VALID_ENERGY_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Parse request data
    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Validate request data
    const validation = validateRequestData(requestData);
    if (!validation.valid) {
      return NextResponse.json(
        { error: `Missing required fields: ${validation.missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Handle array input (multiple hours)
    if (Array.isArray(requestData)) {
      const results = [];
      
      for (const item of requestData) {
        const energyField = `Electricity from ${energyType} - TWh`;
        const existingRecord = await findExistingRecord(energyType, item);
        
        if (existingRecord.exists) {
          // Update only timestamp if data hasn't changed
          const updateData = { timestamp: new Date().toISOString() };
          await db.ref(`${ENERGY_BASE_PATH}/${existingRecord.id}`).update(updateData);
          
          results.push({
            id: existingRecord.id,
            path: `${ENERGY_BASE_PATH}/${existingRecord.id}`,
            action: 'updated',
            data: { ...existingRecord.record, ...updateData }
          });
        } else {
          // Create new record
          const uuid = uuidv4();
          const dbPath = `${ENERGY_BASE_PATH}/${energyType}/${uuid}`;
          
          const entry = {
            code: item.code || "VNM",
            [energyField]: item.Electricity,
            Entity: item.Entity,
            Hour: item.Hour,
            Month: item.Month,
            Year: item.Year,
            timestamp: new Date().toISOString()
          };
          
          await db.ref(dbPath).set(entry);
          results.push({
            id: uuid,
            path: dbPath,
            action: 'created',
            data: entry
          });
        }
      }
      
      return NextResponse.json({
        success: true,
        count: results.length,
        results
      }, { status: 201 });
    }
    
    // Handle single hour input
    const energyField = `Electricity from ${energyType} - TWh`;
    const existingRecord = await findExistingRecord(energyType, requestData);
    
    if (existingRecord.exists) {
      // Update only timestamp if data hasn't changed
      const updateData = { timestamp: new Date().toISOString() };
      await db.ref(`${ENERGY_BASE_PATH}/${existingRecord.id}`).update(updateData);
      
      return NextResponse.json({
        success: true,
        id: existingRecord.id,
        type: energyType,
        path: `${ENERGY_BASE_PATH}/${existingRecord.id}`,
        action: 'updated',
        data: { ...existingRecord.record, ...updateData }
      }, { status: 200 });
    }
    
    // Create new record if it doesn't exist
    const uuid = uuidv4();
    const dbPath = `${ENERGY_BASE_PATH}/${energyType}/${uuid}`;
    
    const entry = {
      code: requestData.code || "VNM",
      [energyField]: requestData.Electricity,
      Entity: requestData.Entity,
      Hour: requestData.Hour,
      Month: requestData.Month,
      Year: requestData.Year,
      timestamp: new Date().toISOString()
    };
    
    await db.ref(dbPath).set(entry);

    return NextResponse.json({
      success: true,
      id: uuid,
      type: energyType,
      path: dbPath,
      action: 'created',
      data: entry
    }, { status: 201 });

  } catch (error) {
    console.error('Error in energy data POST endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    );
  }
}


export async function PUT(request) {
  try {
    // Get the type parameter from the URL
    const url = new URL(request.url);
    const type = url.pathname.split('/').pop();
    const energyType = type?.toLowerCase();

    if (!energyType) {
      return NextResponse.json(
        { error: "Missing type parameter" },
        { status: 400 }
      );
    }

    if (!isValidEnergyType(energyType)) {
      return NextResponse.json(
        { error: `Invalid energy type: ${energyType}` },
        { status: 400 }
      );
    }

    // Parse request data
    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    if (!Array.isArray(requestData)) {
      return NextResponse.json(
        { error: 'PUT requests require an array of items' },
        { status: 400 }
      );
    }

    // Process updates
    const results = [];
    const energyField = `Electricity from ${energyType} - TWh`;

    for (const item of requestData) {
      try {
        const validation = validateRequestData(item);
        if (!validation.valid) {
          results.push({
            id: item.id || 'unknown',
            success: false,
            error: `Missing fields: ${validation.missingFields.join(', ')}`
          });
          continue;
        }

        // Query with index for better performance
        const snapshot = await db.ref(ENERGY_BASE_PATH)
          .orderByChild('Hour')
          .equalTo(item.Hour)
          .once('value');

        let existingId = null;
        let existingRecord = null;

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const record = childSnapshot.val();
            if (record.Entity === item.Entity && 
                record.Month === item.Month && 
                record.Year === item.Year) {
              existingId = childSnapshot.key;
              existingRecord = record;
            }
          });
        }

        const updateData = {
          [energyField]: item.Electricity,
          Entity: item.Entity,
          Hour: item.Hour,
          Month: item.Month,
          Year: item.Year,
          code: item.code || "VNM",
          timestamp: new Date().toISOString()
        };

        if (existingId) {
          // Update existing record
          await db.ref(`${ENERGY_BASE_PATH}/${existingId}`).update(updateData);
          results.push({
            id: existingId,
            success: true,
            path: `${ENERGY_BASE_PATH}/${existingId}`,
            action: 'updated',
            data: updateData
          });
        } else {
          // Create new record
          const newId = uuidv4();
          await db.ref(`${ENERGY_BASE_PATH}/${energyType}/${newId}`).set(updateData);
          results.push({
            id: newId,
            success: true,
            path: `${ENERGY_BASE_PATH}/${energyType}/${newId}`,
            action: 'created',
            data: updateData
          });
        }
      } catch (error) {
        results.push({
          id: item.id || 'unknown',
          success: false,
          error: error.message
        });
      }
    }

    const allSuccess = results.every(result => result.success);
    return NextResponse.json({
      success: allSuccess,
      count: results.length,
      results
    }, {
      status: allSuccess ? 200 : 207
    });

  } catch (error) {
    console.error('Error in energy data PUT endpoint:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const snapshot = await db.collection(ENERGY_BASE_PATH).get();

    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return NextResponse.json({ message: "Đã xóa toàn bộ dữ liệu thành công!" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi xóa dữ liệu:", error);
    return NextResponse.json({ error: "Xảy ra lỗi khi xóa dữ liệu." }, { status: 500 });
  }
}