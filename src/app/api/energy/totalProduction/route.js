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

    // Validation
    if (!data.entity || !data.metadata?.production) {
      return NextResponse.json(
        { error: "Missing required fields (entity, metadata.production)" },
        { status: 400 }
      );
    }

    // Tạo uniqueKey
    const uniqueKey = `${data.entity}-production`;
    const pathRef = db.ref(PATH);
    
    // Kiểm tra bản ghi tồn tại
    const snapshot = await pathRef.orderByChild('uniqueKey').equalTo(uniqueKey).once('value');
    
    let recordId;
    let isUpdate = false;

    if (snapshot.exists()) {
      const existingRecord = Object.entries(snapshot.val())[0];
      recordId = existingRecord[0];
      isUpdate = true;
    } else {
      recordId = data.uuid || uuidv4();
    }

    // Dữ liệu sẽ được lưu
    const saveData = {
      entity: data.entity,
      uuid: recordId,
      uniqueKey: uniqueKey,
      metadata: {
        production: data.metadata.production
      },
      updatedAt: { ".sv": "timestamp" }
    };

    // Sử dụng transaction ở node con để đảm bảo an toàn
    const recordRef = pathRef.child(recordId);
    await recordRef.transaction(async (currentRecord) => {
      // Nếu bản ghi hiện tại mới hơn, không ghi đè
      if (currentRecord && currentRecord.updatedAt > saveData.updatedAt) {
        return currentRecord;
      }
      return saveData;
    });

    return NextResponse.json({
      success: true, 
      message: isUpdate ? "Data updated" : "Data saved",
      id: recordId
    });
    
  } catch (error) {
    console.error("Error saving production data:", error);
    return NextResponse.json(
      { error: "Failed to save data", details: error.message },
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