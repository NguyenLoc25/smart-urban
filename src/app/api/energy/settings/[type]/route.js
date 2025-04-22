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
    const { type } = params;
    const data = await req.json();
    
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
      quantity: data.quantity, // Include quantity
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

// export async function PUT(req, { params }) {
//   try {
//     const { type } = params;
//     const data = await req.json();

    
//     const validation = validateRequest(type, data, true);
//     if (validation) return NextResponse.json(validation, { status: 400 });

//     const config = ENERGY_CONFIG[type];
//     const updatedData = {
//       ...data,
//       quantity: data.quantity, // Include quantity in updates
//       updated_at: new Date().toISOString()
//     };

//     await db.ref(`${config.path}/${data.id}`).update(updatedData);

//     return NextResponse.json({ message: `${type} data updated successfully` });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// export async function DELETE(req, { params }) {
//   try {
//     const { type } = params;
//     const { id } = await req.json();
    
//     if (!ENERGY_CONFIG[type]) {
//       return NextResponse.json({ error: "Invalid energy type" }, { status: 400 });
//     }
//     if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

//     await db.ref(`${ENERGY_CONFIG[type].path}/${id}`).remove();

//     return NextResponse.json({ message: `${type} data deleted successfully` });
//   } catch (error) {
//     return handleError(error);
//   }
// }