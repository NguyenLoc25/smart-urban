import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

const PATH = "energy/totalProduction";

export async function POST(request) {
  try {
    const requestData = await request.json();
    
    // Validation
    if (!requestData.entity || !requestData.metadata?.production) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (entity, metadata.production)" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const uniqueKey = `${requestData.entity}-production`;
    const pathRef = db.ref(PATH);

    // Check for existing record by uniqueKey
    const snapshot = await pathRef
      .orderByChild("uniqueKey")
      .equalTo(uniqueKey)
      .once("value");

    let recordId;
    let action = "created";
    
    if (snapshot.exists()) {
      // Get the first matching record (should be only one)
      const existingRecord = snapshot.val();
      recordId = Object.keys(existingRecord)[0];
      action = "updated";
    } else {
      recordId = requestData.uuid || uuidv4();
    }

    // Prepare data with flat structure
    const recordData = {
      entity: requestData.entity,
      uniqueKey: uniqueKey,
      production: requestData.metadata.production, // Flatten metadata
      updatedAt: now // Use client timestamp instead of server value
    };

    // Simple set/update without transaction
    if (action === "updated") {
      await pathRef.child(recordId).update(recordData);
    } else {
      await pathRef.child(recordId).set(recordData);
    }

    return NextResponse.json({
      success: true,
      action: action,
      id: recordId,
      data: recordData
    });

  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save data",
        error: error.message
      },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const entity = searchParams.get('entity');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    let results = [];
    const dbRef = db.ref(PATH);

    if (id) {
      // Lấy bản ghi cụ thể theo ID
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
      // Lấy tất cả bản ghi với filter tùy chọn
      let query = dbRef.orderByKey();

      if (entity) {
        query = query.orderByChild('entity').equalTo(entity);
      }

      const snapshot = await query.once('value');
      
      snapshot.forEach((childSnapshot) => {
        const record = childSnapshot.val();
        
        // Filter thêm nếu có tham số
        if (year && record.metadata.year !== parseInt(year)) return;
        if (month && record.metadata.month !== parseInt(month)) return;
        
        results.push(record);
      });
    }

    // Sắp xếp theo thời gian (mới nhất trước)
    results.sort((a, b) => 
      (b.updatedAt || 0) - (a.updatedAt || 0)
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