"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, X, Shield, Building, ArrowLeft, BarChart3 } from "lucide-react";
import Link from "next/link";

const API_BASE_URL = "http://localhost:8000";

// --- MOCK DATA: 10 ข้อมูลลูกค้าที่ติดต่อกับเจ้าหน้าที่ (mock) ---
const MOCK_CONTACT_LIST = [
  // ... (unchanged mock data)
  // (for brevity, keep the mock data as is)
  {
    queue_number: "Q1001",
    citizen_name: "สมปอง ใจดี",
    citizen_phone: "0812345678",
    service_name: "ขอสำเนาทะเบียนบ้าน",
    district_name: "ปทุมวัน",
    booking_date: "2024-06-10",
    booking_time: "09:30:00",
    status: "pending",
    user_id: "user_mock_001",
    chat: [
      { type: "user", content: "ขอสอบถามขั้นตอนขอสำเนาทะเบียนบ้าน", timestamp: new Date(Date.now() - 1000 * 60 * 10) },
      { type: "bot", content: "ท่านสามารถขอสำเนาทะเบียนบ้านได้ที่สำนักงานเขต กรุณานำบัตรประชาชนไปด้วยค่ะ", timestamp: new Date(Date.now() - 1000 * 60 * 9) },
      { type: "user", content: "ต้องใช้เอกสารอะไรบ้างครับ", timestamp: new Date(Date.now() - 1000 * 60 * 8) },
      { type: "bot", content: "เอกสารที่ต้องใช้ ได้แก่ 1. บัตรประชาชน 2. ทะเบียนบ้านฉบับจริง", timestamp: new Date(Date.now() - 1000 * 60 * 7) },
      { type: "user", content: "ขอจองคิวได้ไหม", timestamp: new Date(Date.now() - 1000 * 60 * 6) },
      { type: "bot", content: "ท่านต้องการจองคิวขอสำเนาทะเบียนบ้านที่เขตปทุมวัน วันที่ 10 มิ.ย. 2024 เวลา 09:30 ใช่หรือไม่คะ", timestamp: new Date(Date.now() - 1000 * 60 * 5) },
      { type: "user", content: "ใช่ครับ", timestamp: new Date(Date.now() - 1000 * 60 * 4) },
      { type: "bot", content: "จองคิวสำเร็จ หมายเลขคิวของท่านคือ Q1001", timestamp: new Date(Date.now() - 1000 * 60 * 3) },
      { type: "officer", content: "สวัสดีค่ะ เจ้าหน้าที่สมชาย ยินดีให้บริการค่ะ", timestamp: new Date(Date.now() - 1000 * 60 * 2) },
      { type: "user", content: "ขอสอบถามเรื่องเอกสารอีกครั้งครับ", timestamp: new Date(Date.now() - 1000 * 60 * 1.5) },
      { type: "officer", content: "ต้องใช้บัตรประชาชนตัวจริงและทะเบียนบ้านฉบับจริงค่ะ", timestamp: new Date(Date.now() - 1000 * 60 * 1) },
    ]
  },
  // ... (rest of mock data unchanged)
  // FIX: Remove duplicate/invalid object nesting in mock data
  {
    queue_number: "Q1002",
    citizen_name: "วิไลวรรณ สายใจ",
    citizen_phone: "0898765432",
    service_name: "ขอใบอนุญาตประกอบกิจการ",
    district_name: "บางรัก",
    booking_date: "2024-06-11",
    booking_time: "10:00:00",
    status: "confirmed",
    user_id: "user_mock_002",
    chat: [
      { type: "user", content: "ขอสอบถามเรื่องใบอนุญาตประกอบกิจการ", timestamp: new Date(Date.now() - 1000 * 60 * 12) },
      { type: "bot", content: "กรุณาเตรียมเอกสารสำเนาบัตรประชาชนและแบบฟอร์มคำขอ", timestamp: new Date(Date.now() - 1000 * 60 * 11) },
      { type: "user", content: "ขอจองคิว", timestamp: new Date(Date.now() - 1000 * 60 * 10) },
      { type: "bot", content: "จองคิวสำเร็จ หมายเลขคิว Q1002", timestamp: new Date(Date.now() - 1000 * 60 * 9) },
      { type: "officer", content: "เจ้าหน้าที่พร้อมให้บริการค่ะ", timestamp: new Date(Date.now() - 1000 * 60 * 8) },
    ]
  },
  {
    queue_number: "Q1003",
    citizen_name: "ประเสริฐ ทองดี",
    citizen_phone: "0861112233",
    service_name: "ขอใบรับรองถิ่นที่อยู่",
    district_name: "ลาดพร้าว",
    booking_date: "2024-06-12",
    booking_time: "11:00:00",
    status: "completed",
    user_id: "user_mock_003",
    chat: [
      { type: "user", content: "ขอใบรับรองถิ่นที่อยู่", timestamp: new Date(Date.now() - 1000 * 60 * 20) },
      { type: "bot", content: "กรุณานำทะเบียนบ้านและบัตรประชาชนมาด้วย", timestamp: new Date(Date.now() - 1000 * 60 * 19) },
      { type: "user", content: "ขอจองคิว", timestamp: new Date(Date.now() - 1000 * 60 * 18) },
      { type: "bot", content: "จองคิวสำเร็จ หมายเลขคิว Q1003", timestamp: new Date(Date.now() - 1000 * 60 * 17) },
      { type: "officer", content: "ดำเนินการเรียบร้อยแล้วค่ะ", timestamp: new Date(Date.now() - 1000 * 60 * 16) },
    ]
  },
  {
    queue_number: "Q1004",
    citizen_name: "สายฝน รุ่งเรือง",
    citizen_phone: "0855556666",
    service_name: "ขอเปลี่ยนชื่อ",
    district_name: "บางกะปิ",
    booking_date: "2024-06-13",
    booking_time: "13:00:00",
    status: "pending",
    user_id: "user_mock_004",
    chat: [
      { type: "user", content: "ขอเปลี่ยนชื่อ ต้องใช้เอกสารอะไรบ้าง", timestamp: new Date(Date.now() - 1000 * 60 * 15) },
      { type: "bot", content: "ต้องใช้สำเนาทะเบียนบ้านและบัตรประชาชน", timestamp: new Date(Date.now() - 1000 * 60 * 14) },
      { type: "user", content: "ขอจองคิว", timestamp: new Date(Date.now() - 1000 * 60 * 13) },
      { type: "bot", content: "จองคิวสำเร็จ หมายเลขคิว Q1004", timestamp: new Date(Date.now() - 1000 * 60 * 12) },
      { type: "officer", content: "เจ้าหน้าที่จะดำเนินการให้ค่ะ", timestamp: new Date(Date.now() - 1000 * 60 * 11) },
    ]
  },
  {
    queue_number: "Q1005",
    citizen_name: "ณัฐวุฒิ ใจกล้า",
    citizen_phone: "0844445555",
    service_name: "ขอใบเกิด",
    district_name: "ดินแดง",
    booking_date: "2024-06-14",
    booking_time: "14:00:00",
    status: "confirmed",
    user_id: "user_mock_005",
    chat: [
      { type: "user", content: "ขอใบเกิด", timestamp: new Date(Date.now() - 1000 * 60 * 25) },
      { type: "bot", content: "กรุณาเตรียมเอกสารรับรองแพทย์", timestamp: new Date(Date.now() - 1000 * 60 * 24) },
      { type: "user", content: "ขอจองคิว", timestamp: new Date(Date.now() - 1000 * 60 * 23) },
      { type: "bot", content: "จองคิวสำเร็จ หมายเลขคิว Q1005", timestamp: new Date(Date.now() - 1000 * 60 * 22) },
      { type: "officer", content: "เจ้าหน้าที่พร้อมให้บริการค่ะ", timestamp: new Date(Date.now() - 1000 * 60 * 21) },
    ]
  },
  {
    queue_number: "Q1006",
    citizen_name: "อรทัย สายสมร",
    citizen_phone: "0833334444",
    service_name: "ขอใบมรณบัตร",
    district_name: "จตุจักร",
    booking_date: "2024-06-15",
    booking_time: "15:00:00",
    status: "pending",
    user_id: "user_mock_006",
    chat: [
      { type: "user", content: "ขอใบมรณบัตร", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
      { type: "bot", content: "กรุณาเตรียมเอกสารรับรองแพทย์", timestamp: new Date(Date.now() - 1000 * 60 * 29) },
      { type: "user", content: "ขอจองคิว", timestamp: new Date(Date.now() - 1000 * 60 * 28) },
      { type: "bot", content: "จองคิวสำเร็จ หมายเลขคิว Q1006", timestamp: new Date(Date.now() - 1000 * 60 * 27) },
      { type: "officer", content: "เจ้าหน้าที่จะดำเนินการให้ค่ะ", timestamp: new Date(Date.now() - 1000 * 60 * 26) },
    ]
  },
  {
    queue_number: "Q1007",
    citizen_name: "ปิยะพร สายใจ",
    citizen_phone: "0822223333",
    service_name: "ขอใบเปลี่ยนชื่อ",
    district_name: "บางซื่อ",
    booking_date: "2024-06-16",
    booking_time: "16:00:00",
    status: "completed",
    user_id: "user_mock_007",
    chat: [
      { type: "user", content: "ขอใบเปลี่ยนชื่อ", timestamp: new Date(Date.now() - 1000 * 60 * 35) },
      { type: "bot", content: "กรุณาเตรียมเอกสารสำเนาทะเบียนบ้าน", timestamp: new Date(Date.now() - 1000 * 60 * 34) },
      { type: "user", content: "ขอจองคิว", timestamp: new Date(Date.now() - 1000 * 60 * 33) },
      { type: "bot", content: "จองคิวสำเร็จ หมายเลขคิว Q1007", timestamp: new Date(Date.now() - 1000 * 60 * 32) },
      { type: "officer", content: "ดำเนินการเรียบร้อยแล้วค่ะ", timestamp: new Date(Date.now() - 1000 * 60 * 31) },
    ]
  },
  {
    queue_number: "Q1008",
    citizen_name: "สมชาย ใจดี",
    citizen_phone: "0811112222",
    service_name: "ขอใบรับรองโสด",
    district_name: "พระโขนง",
    booking_date: "2024-06-17",
    booking_time: "17:00:00",
    status: "pending",
    user_id: "user_mock_008",
    chat: [
      { type: "user", content: "ขอใบรับรองโสด", timestamp: new Date(Date.now() - 1000 * 60 * 40) },
      { type: "bot", content: "กรุณาเตรียมบัตรประชาชน", timestamp: new Date(Date.now() - 1000 * 60 * 39) },
      { type: "user", content: "ขอจองคิว", timestamp: new Date(Date.now() - 1000 * 60 * 38) },
      { type: "bot", content: "จองคิวสำเร็จ หมายเลขคิว Q1008", timestamp: new Date(Date.now() - 1000 * 60 * 37) },
      { type: "officer", content: "เจ้าหน้าที่จะดำเนินการให้ค่ะ", timestamp: new Date(Date.now() - 1000 * 60 * 36) },
    ]
  },
  {
    queue_number: "Q1009",
    citizen_name: "วราภรณ์ สายสมร",
    citizen_phone: "0800001111",
    service_name: "ขอใบรับรองบุตร",
    district_name: "บางนา",
    booking_date: "2024-06-18",
    booking_time: "18:00:00",
    status: "confirmed",
    user_id: "user_mock_009",
    chat: [
      { type: "user", content: "ขอใบรับรองบุตร", timestamp: new Date(Date.now() - 1000 * 60 * 45) },
      { type: "bot", content: "กรุณาเตรียมสำเนาทะเบียนบ้าน", timestamp: new Date(Date.now() - 1000 * 60 * 44) },
      { type: "user", content: "ขอจองคิว", timestamp: new Date(Date.now() - 1000 * 60 * 43) },
      { type: "bot", content: "จองคิวสำเร็จ หมายเลขคิว Q1009", timestamp: new Date(Date.now() - 1000 * 60 * 42) },
      { type: "officer", content: "เจ้าหน้าที่พร้อมให้บริการค่ะ", timestamp: new Date(Date.now() - 1000 * 60 * 41) },
    ]
  },
  {
    queue_number: "Q1010",
    citizen_name: "สุชาติ ทองดี",
    citizen_phone: "0877778888",
    service_name: "ขอใบรับรองการสมรส",
    district_name: "คลองเตย",
    booking_date: "2024-06-19",
    booking_time: "19:00:00",
    status: "pending",
    user_id: "user_mock_010",
    chat: [
      { type: "user", content: "ขอใบรับรองการสมรส", timestamp: new Date(Date.now() - 1000 * 60 * 50) },
      { type: "bot", content: "กรุณาเตรียมสำเนาทะเบียนสมรส", timestamp: new Date(Date.now() - 1000 * 60 * 49) },
      { type: "user", content: "ขอจองคิว", timestamp: new Date(Date.now() - 1000 * 60 * 48) },
      { type: "bot", content: "จองคิวสำเร็จ หมายเลขคิว Q1010", timestamp: new Date(Date.now() - 1000 * 60 * 47) },
      { type: "officer", content: "เจ้าหน้าที่จะดำเนินการให้ค่ะ", timestamp: new Date(Date.now() - 1000 * 60 * 46) },
    ]
  },
];

export default function OfficerPage() {
  const [activeTab, setActiveTab] = useState("queue");
  const [queueSearch, setQueueSearch] = useState("");
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [officerInputText, setOfficerInputText] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [officerContactInput, setOfficerContactInput] = useState("");
  const messagesEndRef = useRef(null);

  // ฟิลเตอร์รายชื่อคิว
  const filteredQueues = MOCK_CONTACT_LIST.filter(
    (c) =>
      c.queue_number.includes(queueSearch) ||
      c.citizen_name.includes(queueSearch) ||
      c.citizen_phone.includes(queueSearch)
  );

  // ฟิลเตอร์รายชื่อคิวที่ติดต่อกับเจ้าหน้าที่
  const filteredContacts = MOCK_CONTACT_LIST.filter(
    (c) =>
      c.queue_number.includes(contactSearch) ||
      c.citizen_name.includes(contactSearch) ||
      c.citizen_phone.includes(contactSearch)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedQueue, selectedContact]);

  // ส่งข้อความเจ้าหน้าที่ (mock) สำหรับคิว
  const handleOfficerSendMessage = () => {
    if (!officerInputText.trim() || !selectedQueue) return;
    const msg = {
      type: "officer",
      content: officerInputText,
      timestamp: new Date(),
    };
    // Defensive: check chat exists
    if (!Array.isArray(selectedQueue.chat)) selectedQueue.chat = [];
    selectedQueue.chat.push(msg);
    setOfficerInputText("");
    // trigger re-render
    setSelectedQueue({ ...selectedQueue });
  };

  // ส่งข้อความเจ้าหน้าที่ (mock) สำหรับ contact
  const handleOfficerContactSend = () => {
    if (!officerContactInput.trim() || !selectedContact) return;
    const msg = {
      type: "officer",
      content: officerContactInput,
      timestamp: new Date(),
    };
    // Defensive: check chat exists
    if (!Array.isArray(selectedContact.chat)) selectedContact.chat = [];
    selectedContact.chat.push(msg);
    setOfficerContactInput("");
    // trigger re-render
    setSelectedContact({ ...selectedContact });
  };

  // อัปเดตสถานะคิว
  const handleUpdateQueueStatus = (newStatus) => {
    if (!selectedQueue) return;
    setSelectedQueue((prev) => {
      if (!prev) return prev;
      return { ...prev, status: newStatus };
    });
    // update in MOCK_CONTACT_LIST (for mock only)
    selectedQueue.status = newStatus;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">กลับหน้าหลัก</span>
            </Link>
            <Link
              href="/officer/insights"
              className="flex items-center space-x-2 text-blue-600 border-blue-600 border-2 px-4 py-2 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">ข้อมูลเชิงลึก</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">ระบบเจ้าหน้าที่</h1>
              <p className="text-sm text-gray-600">กรุงเทพมหานคร</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("queue")}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === "queue" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Building className="w-5 h-5" />
                <span>จัดการคิว</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === "contact" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>ติดต่อผู้ใช้</span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === "queue" && (
          <div className="bg-white rounded-2xl shadow-lg h-[80vh] flex">
            <div className="w-1/3 border-r border-gray-200 p-6 flex flex-col">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">ค้นหาคิว</label>
                <input
                  type="text"
                  value={queueSearch}
                  onChange={(e) => setQueueSearch(e.target.value)}
                  placeholder="ค้นหาด้วยหมายเลขคิว, ชื่อ, หรือเบอร์โทร"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200 mb-4"
                />
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {filteredQueues.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">ไม่พบคิว</div>
                ) : (
                  filteredQueues.map((q) => (
                    <button
                      key={q.queue_number}
                      onClick={() => setSelectedQueue(q)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 mb-2 ${
                        selectedQueue && selectedQueue.queue_number === q.queue_number
                          ? "bg-blue-50 border-blue-400"
                          : "bg-white border-gray-200 hover:bg-blue-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-700">{q.queue_number}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            q.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : q.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : q.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {q.status === "pending"
                            ? "รอดำเนินการ"
                            : q.status === "confirmed"
                            ? "ยืนยันแล้ว"
                            : q.status === "completed"
                            ? "เสร็จสิ้น"
                            : "ยกเลิก"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">{q.citizen_name}</div>
                      <div className="text-xs text-gray-500">{q.citizen_phone}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              {selectedQueue ? (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 text-lg">ข้อมูลคิว</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">หมายเลข:</span>
                        <span className="font-medium text-lg text-blue-600">{selectedQueue.queue_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ชื่อ:</span>
                        <span className="font-medium">{selectedQueue.citizen_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">โทร:</span>
                        <span className="font-medium">{selectedQueue.citizen_phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">บริการ:</span>
                        <span className="font-medium">{selectedQueue.service_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">เขต:</span>
                        <span className="font-medium">{selectedQueue.district_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">วันที่:</span>
                        <span className="font-medium">{selectedQueue.booking_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">เวลา:</span>
                        <span className="font-medium">{selectedQueue.booking_time.substring(0, 5)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                        <span className="text-gray-600">สถานะ:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            selectedQueue.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : selectedQueue.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : selectedQueue.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedQueue.status === "pending"
                            ? "รอดำเนินการ"
                            : selectedQueue.status === "confirmed"
                            ? "ยืนยันแล้ว"
                            : selectedQueue.status === "completed"
                            ? "เสร็จสิ้น"
                            : "ยกเลิก"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <h5 className="text-sm font-semibold text-gray-700">อัปเดตสถานะ:</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleUpdateQueueStatus("confirmed")}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          ยืนยัน
                        </button>
                        <button
                          onClick={() => handleUpdateQueueStatus("completed")}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          เสร็จสิ้น
                        </button>
                        <button
                          onClick={() => handleUpdateQueueStatus("cancelled")}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          ยกเลิก
                        </button>
                        <button
                          onClick={() => handleUpdateQueueStatus("pending")}
                          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                        >
                          รอดำเนินการ
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {selectedQueue.chat.length === 0 ? (
                      <div className="text-center py-16 text-gray-500">
                        <Shield className="w-20 h-20 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">ยังไม่มีประวัติการสนทนา</p>
                      </div>
                    ) : (
                      [...selectedQueue.chat]
                        .sort((a, b) => {
                          // Defensive: handle timestamp as Date or number
                          const ta = a.timestamp instanceof Date ? a.timestamp.getTime() : a.timestamp;
                          const tb = b.timestamp instanceof Date ? b.timestamp.getTime() : b.timestamp;
                          return ta - tb;
                        })
                        .map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${
                              message.type === "user"
                                ? "justify-start"
                                : message.type === "officer"
                                ? "justify-end"
                                : message.type === "bot"
                                ? "justify-start"
                                : "justify-center"
                            }`}
                          >
                            {message.type === "officer" ? (
                              <div className="flex items-start space-x-3 max-w-3xl justify-end">
                                <div className="px-5 py-3 rounded-2xl bg-blue-600 text-white shadow-md">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-xs font-medium opacity-80">👨‍💼 เจ้าหน้าที่</span>
                                  </div>
                                  <p className="text-sm">{message.content}</p>
                                  <p className="text-xs opacity-70 mt-2">
                                    {message.timestamp &&
                                      (message.timestamp instanceof Date
                                        ? message.timestamp
                                        : new Date(message.timestamp)
                                      ).toLocaleTimeString("th-TH", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </p>
                                </div>
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                  <Shield className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start space-x-3 max-w-3xl">
                                {message.type === "bot" && (
                                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                    <Building className="w-5 h-5 text-white" />
                                  </div>
                                )}
                                {message.type === "user" && (
                                  <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                    <User className="w-5 h-5 text-white" />
                                  </div>
                                )}
                                <div
                                  className={`px-5 py-3 rounded-2xl shadow-md ${
                                    message.type === "user"
                                      ? "bg-gray-200 text-gray-800"
                                      : message.type === "bot"
                                      ? "bg-emerald-600 text-white"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-xs font-medium opacity-80">
                                      {message.type === "bot"
                                        ? "🤖 Bot"
                                        : message.type === "user"
                                        ? "👤 ผู้ใช้"
                                        : "ℹ️ ระบบ"}
                                    </span>
                                  </div>
                                  <p className="text-sm">{message.content}</p>
                                  <p className="text-xs opacity-70 mt-2">
                                    {message.timestamp &&
                                      (message.timestamp instanceof Date
                                        ? message.timestamp
                                        : new Date(message.timestamp)
                                      ).toLocaleTimeString("th-TH", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-6 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={officerInputText}
                        onChange={(e) => setOfficerInputText(e.target.value)}
                        placeholder="พิมพ์ข้อความตอบกลับ..."
                        className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                        onKeyDown={(e) => e.key === "Enter" && handleOfficerSendMessage()}
                      />
                      <button
                        onClick={handleOfficerSendMessage}
                        disabled={!officerInputText.trim() || !selectedQueue}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center space-x-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>ส่ง</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <Shield className="w-20 h-20 mb-4 opacity-50" />
                  <p className="text-lg">เลือกคิวเพื่อดูรายละเอียดและสนทนา</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="bg-white rounded-2xl shadow-lg h-[80vh] flex">
            <div className="w-1/3 border-r border-gray-200 p-6 flex flex-col">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">ค้นหาคิว</label>
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="ค้นหาด้วยหมายเลขคิว, ชื่อ, หรือเบอร์โทร"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200 mb-4"
                />
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {filteredContacts.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">ไม่พบคิว</div>
                ) : (
                  filteredContacts.map((c) => (
                    <button
                      key={c.queue_number}
                      onClick={() => setSelectedContact(c)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 mb-2 ${
                        selectedContact && selectedContact.queue_number === c.queue_number
                          ? "bg-blue-50 border-blue-400"
                          : "bg-white border-gray-200 hover:bg-blue-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-700">{c.queue_number}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            c.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : c.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : c.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {c.status === "pending"
                            ? "รอดำเนินการ"
                            : c.status === "confirmed"
                            ? "ยืนยันแล้ว"
                            : c.status === "completed"
                            ? "เสร็จสิ้น"
                            : "ยกเลิก"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">{c.citizen_name}</div>
                      <div className="text-xs text-gray-500">{c.citizen_phone}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              {selectedContact ? (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 text-lg">ข้อมูลคิว</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">หมายเลข:</span>
                        <span className="font-medium text-lg text-blue-600">{selectedContact.queue_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ชื่อ:</span>
                        <span className="font-medium">{selectedContact.citizen_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">โทร:</span>
                        <span className="font-medium">{selectedContact.citizen_phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">บริการ:</span>
                        <span className="font-medium">{selectedContact.service_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">เขต:</span>
                        <span className="font-medium">{selectedContact.district_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">วันที่:</span>
                        <span className="font-medium">{selectedContact.booking_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">เวลา:</span>
                        <span className="font-medium">{selectedContact.booking_time.substring(0, 5)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                        <span className="text-gray-600">สถานะ:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            selectedContact.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : selectedContact.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : selectedContact.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedContact.status === "pending"
                            ? "รอดำเนินการ"
                            : selectedContact.status === "confirmed"
                            ? "ยืนยันแล้ว"
                            : selectedContact.status === "completed"
                            ? "เสร็จสิ้น"
                            : "ยกเลิก"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {selectedContact.chat.length === 0 ? (
                      <div className="text-center py-16 text-gray-500">
                        <Shield className="w-20 h-20 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">ยังไม่มีประวัติการสนทนา</p>
                      </div>
                    ) : (
                      [...selectedContact.chat]
                        .sort((a, b) => {
                          // Defensive: handle timestamp as Date or number
                          const ta = a.timestamp instanceof Date ? a.timestamp.getTime() : a.timestamp;
                          const tb = b.timestamp instanceof Date ? b.timestamp.getTime() : b.timestamp;
                          return ta - tb;
                        })
                        .map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${
                              message.type === "user"
                                ? "justify-start"
                                : message.type === "officer"
                                ? "justify-end"
                                : message.type === "bot"
                                ? "justify-start"
                                : "justify-center"
                            }`}
                          >
                            {message.type === "officer" ? (
                              <div className="flex items-start space-x-3 max-w-3xl justify-end">
                                <div className="px-5 py-3 rounded-2xl bg-blue-600 text-white shadow-md">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-xs font-medium opacity-80">👨‍💼 เจ้าหน้าที่</span>
                                  </div>
                                  <p className="text-sm">{message.content}</p>
                                  <p className="text-xs opacity-70 mt-2">
                                    {message.timestamp &&
                                      (message.timestamp instanceof Date
                                        ? message.timestamp
                                        : new Date(message.timestamp)
                                      ).toLocaleTimeString("th-TH", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </p>
                                </div>
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                  <Shield className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start space-x-3 max-w-3xl">
                                {message.type === "bot" && (
                                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                    <Building className="w-5 h-5 text-white" />
                                  </div>
                                )}
                                {message.type === "user" && (
                                  <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                    <User className="w-5 h-5 text-white" />
                                  </div>
                                )}
                                <div
                                  className={`px-5 py-3 rounded-2xl shadow-md ${
                                    message.type === "user"
                                      ? "bg-gray-200 text-gray-800"
                                      : message.type === "bot"
                                      ? "bg-emerald-600 text-white"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-xs font-medium opacity-80">
                                      {message.type === "bot"
                                        ? "🤖 Bot"
                                        : message.type === "user"
                                        ? "👤 ผู้ใช้"
                                        : "ℹ️ ระบบ"}
                                    </span>
                                  </div>
                                  <p className="text-sm">{message.content}</p>
                                  <p className="text-xs opacity-70 mt-2">
                                    {message.timestamp &&
                                      (message.timestamp instanceof Date
                                        ? message.timestamp
                                        : new Date(message.timestamp)
                                      ).toLocaleTimeString("th-TH", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-6 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={officerContactInput}
                        onChange={(e) => setOfficerContactInput(e.target.value)}
                        placeholder="พิมพ์ข้อความตอบกลับ..."
                        className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                        onKeyDown={(e) => e.key === "Enter" && handleOfficerContactSend()}
                      />
                      <button
                        onClick={handleOfficerContactSend}
                        disabled={!officerContactInput.trim() || !selectedContact}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center space-x-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>ส่ง</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <Shield className="w-20 h-20 mb-4 opacity-50" />
                  <p className="text-lg">เลือกคิวเพื่อดูรายละเอียดและสนทนา</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}