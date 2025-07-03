import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

const MONTHLY_SUMS_PATH = "energy/totalConsumption/monthlySums";

export async function POST(request) {
    try {
        const requestData = await request.json();
        
        // Accept either 'totalProduction' or 'sum'
        const totalProduction = requestData.totalProduction ?? requestData.sum;
        
        const { year, month } = requestData;
    
        if (!year || !month || totalProduction === undefined) {
          return NextResponse.json(
            { success: false, message: "Missing required fields" },
            { status: 400 }
          );
        }

        const monthlySumsRef = db.ref(MONTHLY_SUMS_PATH);
        const now = new Date().toISOString();
        
        // Find existing record for year/month combination
        const snapshot = await monthlySumsRef
          .orderByChild("year")
          .equalTo(year)
          .once("value");

        let existingRecordKey = null;
        
        snapshot.forEach((childSnapshot) => {
          const record = childSnapshot.val();
          if (record.month === month) {
            existingRecordKey = childSnapshot.key;
          }
        });

        const recordData = {
          year,
          month,
          totalProduction,
          updatedAt: now
        };

        if (existingRecordKey) {
          // Update existing record
          await monthlySumsRef.child(existingRecordKey).update(recordData);
          return NextResponse.json({
            success: true,
            action: "updated",
            uuid: existingRecordKey,
            data: recordData
          });
        } else {
          // Create new record with UUID
          const uuid = uuidv4();
          await monthlySumsRef.child(uuid).set(recordData);
          return NextResponse.json(
            {
              success: true,
              action: "created",
              uuid: uuid,
              data: recordData
            },
            { status: 201 }
          );
        }
    } catch (error) {
        console.error("Processing error:", error);
        return NextResponse.json(
          {
            success: false,
            message: "Server error",
            error: error.message
          },
          { status: 500 }
        );
    }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    const monthlySumsRef = db.ref(MONTHLY_SUMS_PATH);

    let snapshot;
    if (year && month) {
      // Get specific year/month combination
      snapshot = await monthlySumsRef
        .orderByChild("year")
        .equalTo(Number(year))
        .once("value");

      let result = null;
      snapshot.forEach((childSnapshot) => {
        const record = childSnapshot.val();
        if (record.month === month) {
          result = {
            id: childSnapshot.key,
            ...record
          };
        }
      });

      if (!result) {
        return NextResponse.json(
          { success: false, message: "Record not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result
      });
    } else if (year) {
      // Get all months for a specific year
      snapshot = await monthlySumsRef
        .orderByChild("year")
        .equalTo(Number(year))
        .once("value");

      const results = [];
      snapshot.forEach((childSnapshot) => {
        results.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      return NextResponse.json({
        success: true,
        data: results
      });
    } else {
      // Get all records
      snapshot = await monthlySumsRef.once("value");
      const results = [];
      snapshot.forEach((childSnapshot) => {
        results.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      return NextResponse.json({
        success: true,
        data: results
      });
    }
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message
      },
      { status: 500 }
    );
  }
}