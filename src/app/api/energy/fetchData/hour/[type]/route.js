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
  
  if (Array.isArray(data)) {
    const invalidItems = data.filter(item => !item.Hour);
    if (invalidItems.length > 0) {
      return { valid: false, missingFields: ['Hour in some items'] };
    }
    return { valid: true };
  }
  
  const requiredFields = ['Electricity', 'Entity', 'Hour', 'Month', 'Year'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  return {
    valid: missingFields.length === 0,
    missingFields: missingFields.length > 0 ? missingFields : undefined
  };
};

const findExistingRecord = async (energyType, data) => {
  const energyField = `Electricity from ${energyType} - TWh`;
  const snapshot = await db.ref(`${ENERGY_BASE_PATH}/${energyType}`)
    .orderByChild('Hour')
    .equalTo(data.Hour)
    .once('value');
  
  if (snapshot.exists()) {
    const records = snapshot.val();
    for (const [key, record] of Object.entries(records)) {
      if (
        record.Entity === data.Entity &&
        record.Hour === data.Hour &&
        record.Month === data.Month &&
        record.Year === data.Year
      ) {
        return { exists: true, id: key, record };
      }
    }
  }
  return { exists: false };
};

// GET Handler
export async function GET(request, { params }) {
  try {
    const { type } = params;
    const energyType = type.toLowerCase();

    if (!isValidEnergyType(energyType)) {
      return NextResponse.json(
        { error: `Invalid energy type. Valid types are: ${VALID_ENERGY_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    const snapshot = await db.ref(`${ENERGY_BASE_PATH}/${energyType}`).once("value");

    if (!snapshot.exists()) {
      return NextResponse.json(
        { message: "No data available" },
        { status: 404 }
      );
    }

    const data = snapshot.val();
    const energyField = `Electricity from ${energyType} - TWh`;

    const formattedData = Object.entries(data).map(([id, item]) => ({
      id,
      hour: Number(item.Hour) || 0,
      energy: Number(item[energyField]) || 0,
      month: Number(item.Month) || 0,
      year: Number(item.Year) || 0,
      code: item.code || "VNM",
      entity: item.Entity || "",
      timestamp: item.timestamp || ""
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching energy data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST Handler
export async function POST(request, { params }) {
  try {
    const { type } = params;
    const energyType = type.toLowerCase();

    if (!isValidEnergyType(energyType)) {
      return NextResponse.json(
        { error: `Invalid energy type. Valid types are: ${VALID_ENERGY_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    const requestData = await request.json();
    const validation = validateRequestData(requestData);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: `Missing required fields: ${validation.missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const energyField = `Electricity from ${energyType} - TWh`;
    const results = [];
    const dataArray = Array.isArray(requestData) ? requestData : [requestData];

    for (const data of dataArray) {
      const existingRecord = await findExistingRecord(energyType, data);
      const timestamp = new Date().toISOString();
      const entry = {
        code: data.code || "VNM",
        [energyField]: data.Electricity,
        Entity: data.Entity,
        Hour: data.Hour,
        Month: data.Month,
        Year: data.Year,
        timestamp
      };

      if (existingRecord.exists) {
        await db.ref(`${ENERGY_BASE_PATH}/${energyType}/${existingRecord.id}`).update({
          ...entry,
          timestamp
        });
        results.push({
          id: existingRecord.id,
          action: 'updated',
          data: entry
        });
      } else {
        const newId = uuidv4();
        await db.ref(`${ENERGY_BASE_PATH}/${energyType}/${newId}`).set(entry);
        results.push({
          id: newId,
          action: 'created',
          data: entry
        });
      }
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      results
    }, { 
      status: results.some(r => r.action === 'created') ? 201 : 200 
    });

  } catch (error) {
    console.error("Error in energy data POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT Handler
export async function PUT(request, { params }) {
  try {
    const { type } = params;
    const energyType = type.toLowerCase();

    if (!isValidEnergyType(energyType)) {
      return NextResponse.json(
        { error: `Invalid energy type. Valid types are: ${VALID_ENERGY_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    const requestData = await request.json();
    
    if (!Array.isArray(requestData)) {
      return NextResponse.json(
        { error: "PUT request requires an array of items" },
        { status: 400 }
      );
    }

    const energyField = `Electricity from ${energyType} - TWh`;
    const results = [];

    for (const item of requestData) {
      try {
        if (!item.id) {
          results.push({
            success: false,
            error: "Missing id field for update"
          });
          continue;
        }

        const validation = validateRequestData(item);
        if (!validation.valid) {
          results.push({
            id: item.id,
            success: false,
            error: `Missing fields: ${validation.missingFields.join(', ')}`
          });
          continue;
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

        await db.ref(`${ENERGY_BASE_PATH}/${energyType}/${item.id}`).update(updateData);
        results.push({
          id: item.id,
          success: true,
          data: updateData
        });
      } catch (error) {
        results.push({
          id: item.id || 'unknown',
          success: false,
          error: error.message
        });
      }
    }

    const allSuccess = results.every(r => r.success);
    return NextResponse.json({
      success: allSuccess,
      count: results.length,
      results
    }, {
      status: allSuccess ? 200 : 207
    });

  } catch (error) {
    console.error("Error in energy data PUT:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE Handler
export async function DELETE(request, { params }) {
  try {
    const { type } = params;
    const energyType = type?.toLowerCase();

    if (!energyType) {
      // Delete all energy data if no type specified
      const snapshot = await db.ref(ENERGY_BASE_PATH).once('value');
      if (!snapshot.exists()) {
        return NextResponse.json(
          { message: "No data to delete" },
          { status: 404 }
        );
      }

      await db.ref(ENERGY_BASE_PATH).remove();
      return NextResponse.json(
        { message: "All energy data deleted successfully" },
        { status: 200 }
      );
    }

    if (!isValidEnergyType(energyType)) {
      return NextResponse.json(
        { error: `Invalid energy type. Valid types are: ${VALID_ENERGY_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    const snapshot = await db.ref(`${ENERGY_BASE_PATH}/${energyType}`).once('value');
    if (!snapshot.exists()) {
      return NextResponse.json(
        { message: `No ${energyType} data to delete` },
        { status: 404 }
      );
    }

    await db.ref(`${ENERGY_BASE_PATH}/${energyType}`).remove();
    return NextResponse.json(
      { message: `${energyType} data deleted successfully` },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting energy data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}