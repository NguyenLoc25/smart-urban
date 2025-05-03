import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const ENERGY_CONFIG = {
  solar: {
    path: "energy/physic-info/solar",
    requiredFields: ["power", "weight", "efficiency", "size", "origin", "status", "quantity"]
  },
  wind: {
    path: "energy/physic-info/wind",
    requiredFields: ["power", "weight", "efficiency", "size", "origin", "status", "quantity"]
  },
  hydro: {
    path: "energy/physic-info/hydro",
    requiredFields: ["power", "turbine_type", "efficiency", "head_height", "flow_rate", "origin", "status", "quantity"]
  }
};

const validateRequest = (type, data, requireId = false) => {
  if (!ENERGY_CONFIG[type]) {
    return { error: "Invalid energy type" };
  }

  if (requireId && !data.id) {
    return { error: "Missing ID" };
  }

  const config = ENERGY_CONFIG[type];
  const missingFields = config.requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return { error: `Missing required fields: ${missingFields.join(", ")}` };
  }

  // Validate quantity is a positive number
  if (isNaN(data.quantity) || parseInt(data.quantity) <= 0) {
    return { error: "Quantity must be a positive number" };
  }

  return null;
};

const handleError = (error) => {
  console.error(error);
  return NextResponse.json({ error: error.message }, { status: 500 });
};

export async function GET(req, { params }) {
  try {
    const { type } = params;
    const config = ENERGY_CONFIG[type];
    if (!config) return NextResponse.json({ error: "Invalid energy type" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const ref = id ? db.ref(`${config.path}/${id}`) : db.ref(config.path);
    const snapshot = await ref.once("value");

    return NextResponse.json({ data: snapshot.val() || {} });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req, { params }) {
  try {
    // First await the request.json() if needed
    const data = await req.json();
    
    // Then access params
    const { type } = params; // This is fine because params is already resolved by Next.js
    
    // Set default quantity if not provided
    if (!data.quantity) {
      data.quantity = "1";
    }
    
    const validation = validateRequest(type, data);
    if (validation) return NextResponse.json(validation, { status: 400 });

    const config = ENERGY_CONFIG[type];
    const uuid = uuidv4();
    const newData = { 
      uuid,
      id: uuid,
      energy_type: type,
      created_at: new Date().toISOString(),
      quantity: data.quantity,
      ...data
    };
    
    await db.ref(`${config.path}/${uuid}`).set(newData);
    
    return NextResponse.json({ 
      message: `${type} data added successfully`, 
      id: uuid 
    });
  } catch (error) {
    return handleError(error);
  }
}

