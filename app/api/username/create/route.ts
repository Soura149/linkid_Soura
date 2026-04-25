import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateUsername } from "@/lib/validations/username";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, userId } = body;

    const validation = validateUsername(username);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { username },
    });

    return NextResponse.json({ success: true, user }, { status: 200 });

  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("username")) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
    console.error("Username create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
