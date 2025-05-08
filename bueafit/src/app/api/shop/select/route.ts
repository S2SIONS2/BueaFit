import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// GET: 선택된 가게 정보 조회
export const GET = async () => {
    try {
      const cookieStore = cookies();
      const accessToken = (await cookieStore).get("access_token")?.value;
    
      if (!accessToken) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops/selected`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (res.status === 204) {
        return new Response(null, { status: 204 });
      }
  
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch (error) {
      console.error("Error in GET /api/shop/select:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};

// POST: 선택된 가게 설정
export const POST = async (req: NextRequest) => {
  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const shopId = body.shop_id;

    if (!shopId) {
      return NextResponse.json({ error: "Missing shop_id" }, { status: 400 });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops/selected`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ shop_id: shopId }),
    });

    if (res.status === 204) {
      return new Response(null, { status: 204 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error in POST /api/shop/select:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
