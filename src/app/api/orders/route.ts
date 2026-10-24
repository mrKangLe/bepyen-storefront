import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to data directory (Hỗ trợ cả Local Ubuntu và Serverless Vercel)
const ROOT_DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "data")
  : (fs.existsSync(path.resolve(process.cwd(), "..", "data"))
      ? path.resolve(process.cwd(), "..", "data")
      : path.resolve(process.cwd(), "data"));

const ORDERS_FILE = path.join(ROOT_DATA_DIR, "crm_orders.json");
const CUSTOMERS_FILE = path.join(ROOT_DATA_DIR, "crm_customers.json");

function ensureFilesExist() {
  if (!fs.existsSync(ROOT_DATA_DIR)) {
    fs.mkdirSync(ROOT_DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), "utf8");
  }
  if (!fs.existsSync(CUSTOMERS_FILE)) {
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

function readJSON<T>(filePath: string, fallback: T): T {
  try {
    ensureFilesExist();
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading JSON from", filePath, err);
    return fallback;
  }
}

function writeJSON(filePath: string, data: any) {
  try {
    ensureFilesExist();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing JSON to", filePath, err);
  }
}

// 1. LẤY DANH SÁCH ĐƠN HÀNG CRM
export async function GET() {
  const orders = readJSON(ORDERS_FILE, []);
  return NextResponse.json({ orders });
}

// 2. LƯU ĐƠN HÀNG MỚI VÀO CRM VÀ TỰ ĐỘNG CẬP NHẬT HỒ SƠ KHÁCH HÀNG
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const {
      customer_name,
      phone,
      building,
      apartment,
      notes,
      items,
      total_price,
      order_source,
      health_profile,
      zalo_nickname,
      affiliate_code,
    } = payload;

    if (!customer_name || !phone) {
      return NextResponse.json({ error: "Thiếu tên khách hoặc số điện thoại" }, { status: 400 });
    }

    // Tự động chuẩn hóa Zalo Nickname với hậu tố định danh chuẩn: "Khách Yến"
    const addrParts = [apartment ? `Căn ${apartment}` : "", building].filter(Boolean).join(" ");
    const computedNickname =
      zalo_nickname ||
      (addrParts
        ? `${customer_name.trim()} - ${addrParts} - Khách Yến`
        : `${customer_name.trim()} - Khách Yến`);

    const marketingTag = order_source?.includes("doi_vo")
      ? "Cư Dân Đổi Vỏ Xanh · Khách Yến"
      : affiliate_code
      ? `Cư Dân CTV · Ref: ${affiliate_code}`
      : "Cư Dân Ocean Park · Khách Yến";

    const cleanAffiliate = affiliate_code ? String(affiliate_code).trim() : null;
    const orderTotal = Number(total_price) || 0;
    const estCommission = cleanAffiliate ? Math.round(orderTotal * 0.08) : 0;

    const orderId = "OCP-" + Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: orderId,
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      building: building || "",
      apartment: apartment || "",
      notes: notes || "",
      health_profile: health_profile || "",
      zalo_nickname: computedNickname,
      marketing_tag: marketingTag,
      affiliate_code: cleanAffiliate,
      commission_amount: estCommission,
      items: items || [],
      total_price: orderTotal,
      status: "pending",
      order_source: order_source || "web_storefront",
      created_at: new Date().toISOString(),
    };

    // 1. Lưu vào crm_orders.json (Lưu đồng thời cả ở root data và local bot data)
    const orders = readJSON<any[]>(ORDERS_FILE, []);
    orders.unshift(newOrder);
    writeJSON(ORDERS_FILE, orders);

    // Lưu phụ trợ vào 2_BACKEND_BOT_UBUNTU/data/crm_orders.json nếu có
    const botDataDir = path.resolve(process.cwd(), "..", "2_BACKEND_BOT_UBUNTU", "data");
    const botOrdersFile = path.join(botDataDir, "crm_orders.json");
    if (fs.existsSync(botDataDir)) {
      writeJSON(botOrdersFile, orders);
    }

    // 2. Tự động tạo / cập nhật hồ sơ khách hàng vào crm_customers.json
    const customers = readJSON<any[]>(CUSTOMERS_FILE, []);
    const cleanPhone = phone.trim();
    const existingIndex = customers.findIndex((c) => c.phone === cleanPhone);

    const nextCareDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const careNotes = "Khách đặt qua Web/AI Chatbot chân trang. Sau 2 ngày hỏi thăm khẩu vị/độ đậm sợi và nhắc chính sách đổi 10 vỏ hũ tặng 1 hũ.";

    if (existingIndex >= 0) {
      const cust = customers[existingIndex];
      cust.total_orders = (cust.total_orders || 1) + 1;
      cust.total_spent = (cust.total_spent || 0) + newOrder.total_price;
      cust.last_order_at = newOrder.created_at;
      cust.zalo_nickname = computedNickname;
      cust.marketing_suffix = "Khách Yến";
      cust.channel = "Zalo";
      cust.marketing_ready = true;
      cust.care_status = "CHỜ_CHĂM_SÓC_LẠI";
      cust.care_next_date = nextCareDate;
      cust.care_notes = careNotes;
      if (building) cust.building = building;
      if (apartment) cust.apartment = apartment;
      if (health_profile) cust.health_profile = health_profile;
      if (cust.total_spent >= 1000000 || cust.total_orders >= 3) {
        cust.tag = "Khách VIP";
      } else if (cust.total_orders >= 2) {
        cust.tag = "Khách Thân Thiết";
      } else if (order_source?.includes("doi_vo")) {
        cust.tag = "Cư Dân Đổi Vỏ Xanh";
      } else {
        cust.tag = "Khách Đã Mua";
      }
      if (cleanAffiliate && !cust.referred_by) {
        cust.referred_by = cleanAffiliate;
      }
      customers[existingIndex] = cust;
    } else {
      const newCust = {
        id: "CUST-" + (customers.length + 1).toString().padStart(2, "0"),
        name: customer_name.trim(),
        zalo_nickname: computedNickname,
        marketing_suffix: "Khách Yến",
        channel: "Zalo",
        marketing_ready: true,
        phone: cleanPhone,
        building: building || "",
        apartment: apartment || "",
        health_profile: health_profile || "",
        preference: notes || "Thích giao nóng hổi",
        tag: order_source?.includes("doi_vo") ? "Cư Dân Đổi Vỏ Xanh" : "Khách Đã Mua",
        care_status: "CHỜ_CHĂM_SÓC_LẠI",
        care_next_date: nextCareDate,
        care_notes: careNotes,
        referred_by: cleanAffiliate || null,
        total_orders: 1,
        total_spent: newOrder.total_price,
        last_order_at: newOrder.created_at,
        created_at: newOrder.created_at,
      };
      customers.unshift(newCust);
    }
    writeJSON(CUSTOMERS_FILE, customers);

    // Lưu phụ trợ vào 2_BACKEND_BOT_UBUNTU/data/crm_customers.json nếu có
    const botCustFile = path.join(botDataDir, "crm_customers.json");
    if (fs.existsSync(botDataDir)) {
      writeJSON(botCustFile, customers);
    }

    // 3. Tự động đồng bộ đơn hàng về máy Ubuntu tại nhà (nếu có BACKEND_API_URL)
    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    if (backendUrl) {
      try {
        fetch(`${backendUrl.replace(/\/+$/, "")}/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.BACKEND_API_KEY || "bepyen_secret_key_88888888",
          },
          body: JSON.stringify(payload),
        }).catch((err) => console.warn("Lỗi forward đơn sang Backend Ubuntu:", err));
      } catch (err) {
        console.warn("Không thể forward đơn sang Backend:", err);
      }
    }

    console.log(`[CRM] Đã lưu đơn hàng ${orderId} cho khách ${customer_name} (${phone})`);
    return NextResponse.json({ success: true, order: newOrder });
  } catch (err: any) {
    console.error("Lỗi lưu đơn CRM:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
