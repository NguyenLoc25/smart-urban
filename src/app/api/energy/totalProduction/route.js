import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

const PATH = "energy/totalProduction";

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data) {
      return NextResponse.json(
        { error: "No data provided" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!data.entity || !data.metadata?.year || !data.metadata?.month) {
      return NextResponse.json(
        { error: "Missing required fields (entity, metadata.year, metadata.month)" },
        { status: 400 }
      );
    }

    // Generate UUID if not provided
    const recordId = data.uuid || uuidv4();
    const dbRef = db.ref(`${PATH}/${recordId}`);

    // Prepare data with timestamp
    const saveData = {
      entity: data.entity,
      uuid: recordId,
      metadata: {
        ...data.metadata,
        timestamp: new Date().toISOString(),
      },
      updatedAt: { ".sv": "timestamp" } // Server timestamp
    };

    // Save to Realtime Database
    await dbRef.set(saveData);

    return NextResponse.json(
      { 
        success: true, 
        message: "Production data saved successfully",
        id: recordId,
        data: saveData
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving production data:", error);
    return NextResponse.json(
      { 
        error: "Failed to save production data", 
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const id = searchParams.get('id');
    const entity = searchParams.get('entity');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    let results = [];
    const dbRef = db.ref(PATH);

    if (id) {
      // Get specific record by ID
      const snapshot = await dbRef.child(id).once('value');
      if (snapshot.exists()) {
        results.push(snapshot.val());
      } else {
        return NextResponse.json(
          { error: "Record not found" },
          { status: 404 }
        );
      }
    } else {
      // Get all records with optional filtering
      let query = dbRef.orderByKey();

      if (entity) {
        query = query.orderByChild('entity').equalTo(entity);
      }

      const snapshot = await query.once('value');
      
      snapshot.forEach((childSnapshot) => {
        const record = childSnapshot.val();
        
        // Apply additional filters if provided
        if (year && record.metadata.year !== parseInt(year)) return;
        if (month && record.metadata.month !== parseInt(month)) return;
        
        results.push(record);
      });
    }

    // Sort results by timestamp (newest first)
    results.sort((a, b) => 
      new Date(b.metadata.timestamp || 0) - new Date(a.metadata.timestamp || 0)
    );

    return NextResponse.json(
      { 
        success: true, 
        count: results.length,
        data: results 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching production data:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch production data", 
        details: error.message
      },
      { status: 500 }
    );
  }
}