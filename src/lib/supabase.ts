import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface OrderPayload {
  customer_name: string;
  phone: string;
  building: string;
  apartment?: string;
  notes?: string;
  items: {
    id: string | number;
    title: string;
    price: number;
    quantity: number;
  }[];
  total_price: number;
  order_source?: string;
  affiliate_code?: string;
}

export async function submitOrder(order: OrderPayload) {
  // 1. Luôn lưu vào Local CRM Database (File JSON dùng chung)
  try {
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    }).catch((err) => console.warn("Lưu CRM local lỗi:", err));
  } catch (e) {
    console.warn("Không thể gửi tới /api/orders:", e);
  }

  // 2. Nếu có Supabase thì đồng bộ lên Cloud Supabase
  if (!supabase) {
    console.log("[Local CRM] Đơn hàng đã được ghi nhận vào hệ thống nội bộ:", order);
    return { data: { id: "CRM-" + Date.now(), ...order }, error: null };
  }

  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        customer_name: order.customer_name,
        phone: order.phone,
        building: order.building,
        apartment: order.apartment || "",
        notes: order.notes || "",
        items: order.items,
        total_price: order.total_price,
        order_source: order.order_source || "web_storefront",
        status: "pending",
      },
    ])
    .select()
    .single();

  return { data, error };
}
