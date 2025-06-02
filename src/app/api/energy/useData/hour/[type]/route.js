import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // Await params to ensure they're resolved
    const { type } = await params;
    const energyType = type.toLowerCase();

    // Validate energy type
    const validTypes = ['solar', 'wind', 'hydro'];
    if (!validTypes.includes(energyType)) {
      return NextResponse.json(
        { error: "Invalid energy type" },
        { status: 400 }
      );
    }

    const snapshot = await db.ref(`energy/renewable/hour/${energyType}`).once("value");

    if (!snapshot.exists()) {
      return NextResponse.json(
        { message: "No data available" },
        { status: 404 }
      );
    }

    const data = snapshot.val();
    const energyField = `Electricity from ${energyType} - TWh`;

    const formattedData = Object.values(data)
      .map((item) => ({
        hour: Number(item.Hour) || 0,
        energy: Number(item[energyField]) || 0,
        month: Number(item.Month) || 0,
        year: Number(item.Year) || 0,
        code: item.code || "VNM",
        entity: item.Entity || "",
      }))
      .filter((item) => item.hour >= 0 && item.hour <= 23 && item.energy > 0)
      .sort((a, b) => a.hour - b.hour);

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching energy data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}