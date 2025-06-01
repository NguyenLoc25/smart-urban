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
    if (!data.date || !data.entity || !data.year || !data.month) {
      return NextResponse.json(
        { error: "Missing required fields (date, entity, year, month)" },
        { status: 400 }
      );
    }

    // Generate UUID if not provided
    const recordId = data.id || uuidv4();
    const [year, month, day] = data.date.split('-');
    
    // Create Realtime Database reference path
    const refPath = `${PATH}/${year}/${month}/${day}/${recordId}`;
    const dbRef = db.ref(refPath);

    // Prepare data with timestamp
    const saveData = {
      ...data,
      id: recordId,
      timestamp: new Date().toISOString(),
      updatedAt: { ".sv": "timestamp" } // Server timestamp
    };

    // Save to Realtime Database
    await dbRef.set(saveData);

    return NextResponse.json(
      { 
        success: true, 
        message: "Production data saved successfully",
        path: refPath,
        id: recordId
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
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const day = searchParams.get('day');
    const id = searchParams.get('id');
    const entity = searchParams.get('entity');

    let refPath = PATH;
    let results = [];

    // Build the query path based on parameters
    if (year) refPath += `/${year}`;
    if (month) refPath += `/${month}`;
    if (day) refPath += `/${day}`;
    if (id) refPath += `/${id}`;

    const dbRef = db.ref(refPath);

    // Different query scenarios
    if (id) {
      // Get specific record by ID
      const snapshot = await dbRef.once('value');
      if (snapshot.exists()) {
        results.push({
          id: id,
          ...snapshot.val()
        });
      } else {
        return NextResponse.json(
          { error: "Record not found" },
          { status: 404 }
        );
      }
    } else {
      // Get multiple records with potential filtering
      let query = dbRef.orderByKey();

      // Additional filtering by entity if provided
      if (entity && !day) {
        query = dbRef.orderByChild('entity').equalTo(entity);
      }

      const snapshot = await query.once('value');
      
      snapshot.forEach((childSnapshot) => {
        results.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    }

    // Sort results by date if we have multiple records
    if (results.length > 1) {
      results.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

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