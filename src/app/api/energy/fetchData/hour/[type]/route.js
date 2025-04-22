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
  const requiredFields = ['Electricity', 'Entity', 'Hour', 'Month', 'Year'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  return {
    valid: missingFields.length === 0,
    missingFields: missingFields.length > 0 ? missingFields : undefined
  };
};

const createEnergyEntry = (requestData) => {
  return {
    code: requestData.code || "VNM",
    "Electricity from hydro - TWh": requestData.Electricity,
    Entity: requestData.Entity,
    Hour: requestData.Hour,
    Month: requestData.Month,
    Year: requestData.Year,
    timestamp: new Date().toISOString()
  };
};

// Main POST Handler
export async function POST(request, { params }) {
  try {
    const { type } = params;
    const energyType = type.toLowerCase();

    // Validate energy type
    if (!isValidEnergyType(energyType)) {
      return NextResponse.json(
        { error: `Invalid energy type. Valid types are: ${VALID_ENERGY_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Parse and validate request data
    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const validation = validateRequestData(requestData);
    if (!validation.valid) {
      return NextResponse.json(
        { error: `Missing required fields: ${validation.missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create and save new entry
    const uuid = uuidv4();
    const newEntry = createEnergyEntry(requestData);
    const dbPath = `${ENERGY_BASE_PATH}/${energyType}/${uuid}`;

    await db.ref(dbPath).set(newEntry);

    // Successful response
    return NextResponse.json({
      success: true,
      id: uuid,
      type: energyType,
      path: dbPath,
      data: newEntry
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