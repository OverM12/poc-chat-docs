"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Send,
  MessageCircle,
  MapPin,
  Clock,
  User,
  X,
  QrCode,
  CheckCircle,
  Building,
  Phone,
  Shield,
  BarChart3,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

const PRIMARY_COLOR = "#4393d9";
const PRIMARY_COLOR_DARK = "#2d5aa0";
const PRIMARY_COLOR_LIGHT = "#e8f2ff";
const PRIMARY_COLOR_TEXT = "text-[#4393d9]";
const PRIMARY_COLOR_BG = "bg-[#4393d9]";
const PRIMARY_COLOR_BORDER = "border-[#4393d9]";
const PRIMARY_COLOR_HOVER_BG = "hover:bg-[#2d5aa0]";
const PRIMARY_COLOR_HOVER_TEXT = "hover:text-white";
const PRIMARY_COLOR_RING = "focus:ring-[#4393d9]";
const PRIMARY_COLOR_HOVER_BORDER = "hover:border-[#4393d9]";

const SAMPLE_QUESTIONS = [
  "วิธีสมัครทะเบียนราษฎร",
  "ขั้นตอนการขอใบอนุญาตประกอบธุรกิจ",
  "การชำระภาษีโรงเรือนและที่ดิน",
  "บริการสาธารณสุขและสิ่งแวดล้อม",
];

// Simple QR Code generator using canvas
const generateQRCode = (text) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 200;
    canvas.height = 200;

    // Simple QR-like pattern (for demo purposes)
    ctx.fillStyle = PRIMARY_COLOR;
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = "#FFFFFF";

    // Create a simple pattern
    const size = 10;
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if ((i + j + text.length) % 2 === 0) {
          ctx.fillRect(i * size, j * size, size, size);
        }
      }
    }

    // Add corner squares
    ctx.fillStyle = PRIMARY_COLOR;
    ctx.fillRect(0, 0, 60, 60);
    ctx.fillRect(140, 0, 60, 60);
    ctx.fillRect(0, 140, 60, 60);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(10, 10, 40, 40);
    ctx.fillRect(150, 10, 40, 40);
    ctx.fillRect(10, 150, 40, 40);

    ctx.fillStyle = PRIMARY_COLOR;
    ctx.fillRect(20, 20, 20, 20);
    ctx.fillRect(160, 20, 20, 20);
    ctx.fillRect(20, 160, 20, 20);

    resolve(canvas.toDataURL());
  });
};

// Generate a random userId for demo (in real app, use login/session)
function getOrCreateUserId() {
  if (typeof window === "undefined") return "";
  let userId = localStorage.getItem("chat_user_id");
  if (!userId) {
    userId = "user_" + Math.random().toString(36).substring(2, 12);
    localStorage.setItem("chat_user_id", userId);
  }
  return userId;
}

// Mock officer chat data
const MOCK_OFFICER_RESPONSES = [
  {
    type: "officer",
    content: "สวัสดีค่ะ/ครับ มีอะไรให้เจ้าหน้าที่ช่วยเหลือคะ?",
    timestamp: new Date(),
    officerName: "เจ้าหน้าที่สมชาย",
  },
  {
    type: "officer",
    content: "กรุณารอสักครู่ เจ้าหน้าที่กำลังตรวจสอบข้อมูลของคุณ",
    timestamp: new Date(),
    officerName: "เจ้าหน้าที่สมชาย",
  },
];

export default function ChatBot() {
  // --- State for user chat ---
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- State for queue booking ---
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showQueueStatus, setShowQueueStatus] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [availableQueues, setAvailableQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [bookingData, setBookingData] = useState({
    citizen_name: "",
    citizen_phone: "",
    citizen_email: "",
    notes: "",
  });
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [bookedQueue, setBookedQueue] = useState(null);
  const [smartBookingData, setSmartBookingData] = useState(null);

  // --- User id for chat history ---
  const [userId, setUserId] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // --- Officer chat state ---
  const [isOfficerChat, setIsOfficerChat] = useState(false);
  const [officerInput, setOfficerInput] = useState("");
  const [isWaitingOfficer, setIsWaitingOfficer] = useState(false);

  // --- Scroll to bottom on new message ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOfficerChat]);

  // --- On mount, get userId and load chat history ---
  useEffect(() => {
    const id = getOrCreateUserId();
    setUserId(id);
    fetchUserChatHistory(id);
  }, []);

  // --- Fetch user chat history from backend ---
  const fetchUserChatHistory = async (uid) => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/history?user_id=${uid}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(
          data.map((msg) => ({
            ...msg,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
          }))
        );
      }
    } catch (e) {
      // fallback: do nothing
    }
  };

  // --- Save user chat message to backend ---
  const saveUserChatMessage = async (msg) => {
    try {
      await fetch(`${API_BASE_URL}/chat/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        }),
        // mode: "cors", // Uncomment if needed
      });
    } catch (e) { }
  };

  // --- Send message to LLM and save history ---
  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    const userMessage = {
      type: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    saveUserChatMessage(userMessage);

    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ question: text, user_id: userId }),
        // mode: "cors", // Uncomment if needed
      });

      if (!response.ok) {
        throw new Error("Bad response from server");
      }

      const data = await response.json();

      // เก็บข้อมูลบริการจาก response
      const serviceInfo = data.relevant_documents?.[0];
      if (serviceInfo) {
        setSmartBookingData({
          service_id: serviceInfo.service_id,
          district_id: serviceInfo.district_id,
          province_id: serviceInfo.province_id,
          service_name: serviceInfo.service,
          district_name: serviceInfo.district,
          province_name: serviceInfo.province,
        });
      }

      const botMessage = {
        type: "bot",
        content: data.answer,
        timestamp: new Date(),
        showQueueButton: !!serviceInfo,
        showContactButton: true,
        serviceInfo: serviceInfo,
      };
      setMessages((prev) => [...prev, botMessage]);
      saveUserChatMessage(botMessage);
    } catch (error) {
      const errorMessage = {
        type: "bot",
        content:
          "ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง หรือติดต่อเจ้าหน้าที่เพื่อขอความช่วยเหลือ",
        timestamp: new Date(),
        showContactButton: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      saveUserChatMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Officer chat logic ---
  // When switching to officer chat, just change the profile and continue the conversation
  const handleContactOfficer = () => {
    setIsOfficerChat(true);
    setIsWaitingOfficer(true);

    // Convert all previous messages to officer chat format
    // We'll keep the same messages, but change the profile color/icons in the UI
    setTimeout(() => {
      setIsWaitingOfficer(false);
      // Optionally, add a system message or officer greeting
      setMessages((prev) => [
        ...prev,
        {
          type: "officer",
          content: "สวัสดีค่ะ/ครับ มีอะไรให้เจ้าหน้าที่ช่วยเหลือคะ?",
          timestamp: new Date(),
          officerName: "เจ้าหน้าที่สมชาย",
        },
      ]);
    }, 1000);
  };

  const handleSendOfficerMessage = (e) => {
    e.preventDefault();
    if (!officerInput.trim()) return;
    const userMsg = {
      type: "user",
      content: officerInput,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setOfficerInput("");
    setIsWaitingOfficer(true);

    // Simulate officer reply after 2 seconds (mock)
    setTimeout(() => {
      // Pick a random mock reply or repeat the last
      const mock =
        MOCK_OFFICER_RESPONSES[
          Math.floor(Math.random() * MOCK_OFFICER_RESPONSES.length)
        ];
      setMessages((prev) => [
        ...prev,
        {
          ...mock,
          timestamp: new Date(),
        },
      ]);
      setIsWaitingOfficer(false);
    }, 2000);
  };

  const handleBackToBot = () => {
    setIsOfficerChat(false);
    setOfficerInput("");
    setIsWaitingOfficer(false);
  };

  // --- Queue booking logic ---
  const fetchDistricts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/districts`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });
      const data = await response.json();
      setDistricts(
        data.filter((district) => district.province_name === "กรุงเทพมหานคร")
      );
    } catch (error) {
      setDistricts([]);
    }
  };

  const fetchServices = async (districtId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/services?district_id=${districtId}`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        }
      );
      const data = await response.json();
      setServices(data);
    } catch (error) {
      setServices([]);
    }
  };

  const fetchAvailableQueues = async (serviceId) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `${API_BASE_URL}/queue/bookings?service_id=${serviceId}&booking_date=${today}`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        }
      );
      const existingQueues = await response.json();

      const timeSlots = [];
      for (let hour = 9; hour <= 16; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}:00`;
          const isBooked = existingQueues.some(
            (queue) => queue.booking_time === time
          );
          if (!isBooked) {
            timeSlots.push({
              time,
              display: `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`,
            });
          }
        }
      }
      setAvailableQueues(timeSlots);
    } catch (error) {
      setAvailableQueues([]);
    }
  };

  const handleSmartQueueBooking = async () => {
    if (!smartBookingData) {
      alert("ไม่พบข้อมูลบริการ กรุณาถามเกี่ยวกับบริการที่ต้องการก่อน");
      return;
    }
    setSelectedDistrict(smartBookingData.district_id.toString());
    setSelectedService(smartBookingData.service_id.toString());
    await fetchDistricts();
    await fetchServices(smartBookingData.district_id);
    await fetchAvailableQueues(smartBookingData.service_id);
    setShowQueueModal(true);
  };

  const handleQueueCheck = async () => {
    setShowQueueModal(true);
    await fetchDistricts();
  };

  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
    setSelectedService("");
    setServices([]);
    setAvailableQueues([]);
    if (districtId) {
      fetchServices(districtId);
    }
  };

  const handleServiceChange = (serviceId) => {
    setSelectedService(serviceId);
    setAvailableQueues([]);
    if (serviceId) {
      fetchAvailableQueues(serviceId);
    }
  };

  const handleQueueSelection = (queue) => {
    setSelectedQueue(queue);
    setShowQueueModal(false);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const serviceId = parseInt(selectedService);
      if (!serviceId) {
        alert("กรุณาเลือกบริการ");
        return;
      }
      const bookingPayload = {
        ...bookingData,
        service_id: serviceId,
        booking_date: new Date().toISOString().split("T")[0],
        booking_time: selectedQueue.time,
        user_id: userId,
      };
      const response = await fetch(`${API_BASE_URL}/queue/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(bookingPayload),
        // mode: "cors", // Uncomment if needed
      });
      if (!response.ok) {
        throw new Error("Bad response from server");
      }
      const result = await response.json();
      setBookedQueue(result);

      // Generate QR Code
      const qrData = JSON.stringify({
        queue_number: result.queue_number,
        citizen_name: result.citizen_name,
        service: result.service_name,
        district: result.district_name,
        date: result.booking_date,
        time: result.booking_time,
      });

      const qrUrl = await generateQRCode(qrData);
      setQrCodeUrl(qrUrl);

      setShowBookingForm(false);
      setShowSuccessModal(true);
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการจองคิว กรุณาลองใหม่");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setBookingData({
      citizen_name: "",
      citizen_phone: "",
      citizen_email: "",
      notes: "",
    });
    setSelectedDistrict("");
    setSelectedService("");
    setSelectedQueue(null);
    setSmartBookingData(null);
  };

  const handleShowQueueStatus = () => {
    setShowQueueStatus(true);
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf4fb] to-[#b8d8ef] max-w-xl mx-auto">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              {/* <Building className="w-6 h-6 text-white" /> */}
              <Image src="/bk-logo.png" alt="logo" width={500} height={500} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">บริการประชาชน</h1>
              <p className="text-sm text-gray-600">กรุงเทพมหานคร</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShowQueueStatus}
              className={`flex items-center space-x-2 ${PRIMARY_COLOR_BG} text-white px-4 py-2 rounded-xl ${PRIMARY_COLOR_HOVER_BG} transition-all duration-200 shadow-md hover:shadow-lg`}
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <QrCode className="w-4 h-4" />
              <span className="font-medium">ตรวจสอบคิว</span>
            </button>
            {/* <Link
              href="/insights"
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">ข้อมูลเชิงลึก</span>
            </Link> */}
            {/* <Link
              href="/officer"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Shield className="w-4 h-4" />
              <span className="font-medium">เจ้าหน้าที่</span>
            </Link> */}
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Unified chat area, just switch profile color/icon if isOfficerChat */}
        <div className="space-y-6 mb-6">
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  {/* <Building className="w-12 h-12 text-white" /> */}
                  <Image src="/bk-logo.png" alt="logo" width={500} height={500} />
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-3">
                  กรุงเทพมหานคร
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  ยินดีต้อนรับสู่ระบบบริการประชาชนออนไลน์
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SAMPLE_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(question)}
                      className={`p-4 rounded-xl shadow-sm border border-gray-200 ${PRIMARY_COLOR_HOVER_BORDER} bg-white hover:shadow-md transition-all duration-200 text-left group`}
                    >
                      <div className="flex items-start space-x-3">
                        <MessageCircle className={`w-5 h-5 ${PRIMARY_COLOR_TEXT} mt-0.5 flex-shrink-0 group-hover:text-[#4682b4] transition-colors`} />
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                          {question}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Chat Messages */
            <>
              {isOfficerChat && (
                <div className="flex items-center mb-4">
                  <button
                    onClick={handleBackToBot}
                    className="mr-2 p-2 rounded-full hover:bg-gray-100 transition"
                    title="กลับไปคุยกับบอท"
                  >
                    <Shield className="w-5 h-5" style={{ color: PRIMARY_COLOR }} />
                  </button>
                  <span className={`font-bold text-lg`} style={{ color: PRIMARY_COLOR }}>แชทกับเจ้าหน้าที่</span>
                </div>
              )}
              {messages.map((message, index) => {
                // Determine profile color/icon based on isOfficerChat
                let isUser = message.type === "user";
                let isBot = message.type === "bot";
                let isOfficer = message.type === "officer";
                let isSystem = message.type === "system";
                // In officer chat, bot messages become officer messages (profile color changes)
                let leftProfile = null;
                if (isOfficerChat) {
                  if (!isUser) {
                    leftProfile = (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: PRIMARY_COLOR }}>
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                    );
                  }
                } else {
                  if (isBot) {
                    leftProfile = (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: PRIMARY_COLOR }}>
                        <Building className="w-5 h-5 text-white" />
                      </div>
                    );
                  }
                }
                return (
                  <div
                    key={index}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}
                  >
                    <div className="flex items-start space-x-3 max-w-3xl">
                      {!isUser && leftProfile}
                      <div
                        className={`rounded-2xl px-5 py-4 shadow-md ${
                          isUser
                            ? isOfficerChat
                              ? `${PRIMARY_COLOR_BG} text-white`
                              : `${PRIMARY_COLOR_BG} text-white`
                            : isOfficerChat
                              ? "bg-white text-gray-800 border"
                                + " border-[#b8d8ef]"
                              : "bg-white text-gray-800 border border-gray-100"
                        }`}
                        style={
                          isUser
                            ? { backgroundColor: PRIMARY_COLOR }
                            : isOfficerChat && !isUser
                              ? { borderColor: "#b8d8ef" }
                              : undefined
                        }
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                        {/* แสดงข้อมูลบริการจาก response */}
                        {message.serviceInfo && !isOfficerChat && (
                          <div className="mt-4 p-3 rounded-xl border" style={{ backgroundColor: PRIMARY_COLOR_LIGHT, borderColor: PRIMARY_COLOR }}>
                            <div className="text-sm" style={{ color: PRIMARY_COLOR }}>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium">{message.serviceInfo.service}</span>
                              </div>
                              <div style={{ color: PRIMARY_COLOR }}>
                                {message.serviceInfo.district}, {message.serviceInfo.province}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="text-xs opacity-70 mt-3">
                          {message.officerName && isOfficerChat && (
                            <span className="mr-2" style={{ color: PRIMARY_COLOR }}>{message.officerName}</span>
                          )}
                          {message.timestamp &&
                            new Date(message.timestamp).toLocaleTimeString("th-TH", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </div>
                        {!isOfficerChat && (
                          <div className="flex justify-between">
                            <div className="flex flex-row gap-3 mt-4">
                              {message.showQueueButton && (
                                <button
                                  onClick={handleSmartQueueBooking}
                                  className={`text-white px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg font-medium w-44`}
                                  style={{
                                    backgroundColor: PRIMARY_COLOR,
                                    border: "none",
                                  }}
                                >
                                  <Clock className="w-4 h-4" />
                                  <span>จองคิวบริการนี้</span>
                                </button>
                              )}
                              {message.showContactButton && (
                                <button
                                  type="button"
                                  onClick={handleContactOfficer}
                                  className={`px-5 py-2.5 rounded-xl border-2 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg font-medium w-44`}
                                  style={{
                                    color: PRIMARY_COLOR,
                                    borderColor: PRIMARY_COLOR,
                                  }}
                                  onMouseOver={e => {
                                    e.currentTarget.style.backgroundColor = PRIMARY_COLOR;
                                    e.currentTarget.style.color = "#fff";
                                  }}
                                  onMouseOut={e => {
                                    e.currentTarget.style.backgroundColor = "";
                                    e.currentTarget.style.color = PRIMARY_COLOR;
                                  }}
                                >
                                  <Phone className="w-4 h-4" />
                                  <span>ติดต่อเจ้าหน้าที่</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {isUser && (
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {isWaitingOfficer && isOfficerChat && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: PRIMARY_COLOR }}>
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl px-5 py-4 shadow-md border" style={{ borderColor: "#b8d8ef" }}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: PRIMARY_COLOR }}></div>
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: PRIMARY_COLOR, animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: PRIMARY_COLOR, animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isLoading && !isOfficerChat && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: PRIMARY_COLOR }}>
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl px-5 py-4 shadow-md border border-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: PRIMARY_COLOR }}></div>
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: PRIMARY_COLOR, animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: PRIMARY_COLOR, animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div
          className={
            isOfficerChat
              ? "bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border"
              : "bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200"
          }
          style={isOfficerChat ? { borderColor: "#b8d8ef" } : undefined}
        >
          <form
            onSubmit={
              isOfficerChat
                ? handleSendOfficerMessage
                : (e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }
            }
            className="flex space-x-4"
          >
            <input
              ref={!isOfficerChat ? inputRef : undefined}
              type="text"
              value={isOfficerChat ? officerInput : inputText}
              onChange={(e) =>
                isOfficerChat
                  ? setOfficerInput(e.target.value)
                  : setInputText(e.target.value)
              }
              placeholder={
                isOfficerChat
                  ? "พิมพ์ข้อความถึงเจ้าหน้าที่..."
                  : "พิมพ์คำถามของคุณ..."
              }
              className={
                isOfficerChat
                  ? `flex-1 px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 ${PRIMARY_COLOR_RING} focus:border-transparent bg-white transition-all duration-200`
                  : `flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 ${PRIMARY_COLOR_RING} focus:border-transparent bg-white transition-all duration-200`
              }
              style={isOfficerChat ? { borderColor: "#b8d8ef" } : undefined}
              disabled={isOfficerChat ? isWaitingOfficer : isLoading}
            />
            <button
              type="submit"
              disabled={
                isOfficerChat
                  ? isWaitingOfficer || !officerInput.trim()
                  : isLoading || !inputText.trim()
              }
              className={`px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg font-medium`}
              style={{
                backgroundColor: PRIMARY_COLOR,
                color: "#fff",
                ...(isOfficerChat ? {} : {}),
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = PRIMARY_COLOR_DARK;
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = PRIMARY_COLOR;
              }}
            >
              <Send className="w-4 h-4" />
              <span>ส่ง</span>
            </button>
          </form>
        </div>
      </main>

      {/* Queue Selection Modal */}
      {showQueueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">จองคิว</h3>
              <button
                onClick={() => setShowQueueModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {smartBookingData ? (
              <div className="space-y-5">
                <div className="p-4 rounded-xl border" style={{ backgroundColor: PRIMARY_COLOR_LIGHT, borderColor: PRIMARY_COLOR }}>
                  <div className="text-sm" style={{ color: PRIMARY_COLOR }}>
                    <div className="text-center mb-2">
                      <span className="font-semibold">
                        บริการที่แนะนำสำหรับคุณ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>บริการ:</span>
                      <span className="font-semibold">
                        {smartBookingData.service_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>เขต:</span>
                      <span className="font-semibold">
                        {smartBookingData.district_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>จังหวัด:</span>
                      <span className="font-semibold">
                        {smartBookingData.province_name}
                      </span>
                    </div>
                  </div>
                </div>
                {/* District Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    เขต
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${PRIMARY_COLOR_RING} bg-white transition-all duration-200`}
                    style={{ borderColor: PRIMARY_COLOR }}
                  >
                    <option value="">เลือกเขต</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    บริการ
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    disabled={!selectedDistrict}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${PRIMARY_COLOR_RING} disabled:opacity-50 disabled:bg-gray-50 bg-white transition-all duration-200`}
                    style={{ borderColor: PRIMARY_COLOR }}
                  >
                    <option value="">เลือกบริการ</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Available Time Slots */}
                {availableQueues.length > 0 ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      เลือกเวลาที่ต้องการ
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                      {availableQueues.map((queue) => (
                        <button
                          key={queue.time}
                          onClick={() => handleQueueSelection(queue)}
                          className={`p-3 border rounded-xl transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md`}
                          style={{
                            borderColor: PRIMARY_COLOR,
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.backgroundColor = PRIMARY_COLOR;
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.backgroundColor = "";
                            e.currentTarget.style.color = "";
                          }}
                        >
                          {queue.display}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : selectedService ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>ไม่มีคิวว่างในขณะนี้</p>
                  </div>
                ) : selectedDistrict ? (
                  <div className="text-center py-4 text-gray-500">
                    <p>กรุณาเลือกบริการ</p>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>กรุณาเลือกเขต</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {/* District Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    เขต
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${PRIMARY_COLOR_RING} bg-white transition-all duration-200`}
                    style={{ borderColor: PRIMARY_COLOR }}
                  >
                    <option value="">เลือกเขต</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    บริการ
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    disabled={!selectedDistrict}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${PRIMARY_COLOR_RING} disabled:opacity-50 disabled:bg-gray-50 bg-white transition-all duration-200`}
                    style={{ borderColor: PRIMARY_COLOR }}
                  >
                    <option value="">เลือกบริการ</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Available Time Slots */}
                {availableQueues.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      เวลาที่ว่าง
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                      {availableQueues.map((queue) => (
                        <button
                          key={queue.time}
                          onClick={() => handleQueueSelection(queue)}
                          className={`p-3 border rounded-xl transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md`}
                          style={{
                            borderColor: PRIMARY_COLOR,
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.backgroundColor = PRIMARY_COLOR;
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.backgroundColor = "";
                            e.currentTarget.style.color = "";
                          }}
                        >
                          {queue.display}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                กรอกข้อมูลการจอง
              </h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อ-นามสกุล *
                </label>
                <input
                  type="text"
                  required
                  value={bookingData.citizen_name}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      citizen_name: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${PRIMARY_COLOR_RING} transition-all duration-200`}
                  style={{ borderColor: PRIMARY_COLOR }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เบอร์โทรศัพท์ *
                </label>
                <input
                  type="tel"
                  required
                  value={bookingData.citizen_phone}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      citizen_phone: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${PRIMARY_COLOR_RING} transition-all duration-200`}
                  style={{ borderColor: PRIMARY_COLOR }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={bookingData.citizen_email}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      citizen_email: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${PRIMARY_COLOR_RING} transition-all duration-200`}
                  style={{ borderColor: PRIMARY_COLOR }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  หมายเหตุ
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, notes: e.target.value })
                  }
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${PRIMARY_COLOR_RING} transition-all duration-200`}
                  style={{ borderColor: PRIMARY_COLOR }}
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border">
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>เวลาที่เลือก:</span>
                    <span className="font-semibold" style={{ color: PRIMARY_COLOR }}>
                      {selectedQueue?.display}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>วันที่:</span>
                    <span className="font-semibold" style={{ color: PRIMARY_COLOR }}>
                      {new Date().toLocaleDateString("th-TH")}
                    </span>
                  </div>
                  {smartBookingData && (
                    <>
                      <div className="flex justify-between">
                        <span>บริการ:</span>
                        <span className="font-semibold" style={{ color: PRIMARY_COLOR }}>
                          {smartBookingData.service_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>เขต:</span>
                        <span className="font-semibold" style={{ color: PRIMARY_COLOR }}>
                          {smartBookingData.district_name}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className={`flex-1 text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium`}
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  onMouseOver={e => {
                    e.currentTarget.style.backgroundColor = PRIMARY_COLOR_DARK;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = PRIMARY_COLOR;
                  }}
                >
                  จองคิว
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && bookedQueue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: PRIMARY_COLOR_LIGHT }}>
                <CheckCircle className="w-10 h-10" style={{ color: PRIMARY_COLOR }} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                จองคิวสำเร็จ!
              </h3>
              <p className="text-gray-600 mb-6">คุณได้รับหมายเลขคิว</p>
              <div className="bg-gray-50 p-5 rounded-xl mb-6 border">
                <div className="text-3xl font-bold mb-3" style={{ color: PRIMARY_COLOR }}>
                  {bookedQueue.queue_number}
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>ชื่อ:</span>
                    <span className="font-medium">
                      {bookedQueue.citizen_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>บริการ:</span>
                    <span className="font-medium">
                      {bookedQueue.service_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>เขต:</span>
                    <span className="font-medium">
                      {bookedQueue.district_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>วันที่:</span>
                    <span className="font-medium">
                      {new Date(bookedQueue.booking_date).toLocaleDateString(
                        "th-TH"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>เวลา:</span>
                    <span className="font-medium">
                      {bookedQueue.booking_time.substring(0, 5)}
                    </span>
                  </div>
                </div>
              </div>
              {qrCodeUrl && (
                <div className="mb-6">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="mx-auto w-32 h-32 rounded-xl"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    QR Code สำหรับตรวจสอบคิว
                  </p>
                </div>
              )}
              <button
                onClick={handleSuccessClose}
                className={`w-full text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium`}
                style={{ backgroundColor: PRIMARY_COLOR }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = PRIMARY_COLOR_DARK;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = PRIMARY_COLOR;
                }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Queue Status Modal */}
      {showQueueStatus && bookedQueue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                ข้อมูลคิวของคุณ
              </h3>
              <button
                onClick={() => setShowQueueStatus(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="text-center">
              <div className="bg-gray-50 p-5 rounded-xl mb-6 border">
                <div className="text-3xl font-bold mb-3" style={{ color: PRIMARY_COLOR }}>
                  {bookedQueue.queue_number}
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>ชื่อ:</span>
                    <span className="font-medium">
                      {bookedQueue.citizen_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>โทร:</span>
                    <span className="font-medium">
                      {bookedQueue.citizen_phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>บริการ:</span>
                    <span className="font-medium">
                      {bookedQueue.service_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>เขต:</span>
                    <span className="font-medium">
                      {bookedQueue.district_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>วันที่:</span>
                    <span className="font-medium">
                      {new Date(bookedQueue.booking_date).toLocaleDateString(
                        "th-TH"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>เวลา:</span>
                    <span className="font-medium">
                      {bookedQueue.booking_time.substring(0, 5)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t">
                    <span>สถานะ:</span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${bookedQueue.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : bookedQueue.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : bookedQueue.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {bookedQueue.status === "pending"
                        ? "รอดำเนินการ"
                        : bookedQueue.status === "confirmed"
                          ? "ยืนยันแล้ว"
                          : bookedQueue.status === "completed"
                            ? "เสร็จสิ้น"
                            : "ยกเลิก"}
                    </span>
                  </div>
                  {bookedQueue.notes && (
                    <div className="mt-3 pt-2 border-t text-left">
                      <div className="text-xs text-gray-500 mb-1">
                        หมายเหตุ:
                      </div>
                      <div className="text-sm">{bookedQueue.notes}</div>
                    </div>
                  )}
                </div>
              </div>
              {qrCodeUrl && (
                <div className="mb-6">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="mx-auto w-32 h-32 rounded-xl"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    QR Code สำหรับตรวจสอบคิว
                  </p>
                </div>
              )}
              <button
                onClick={() => setShowQueueStatus(false)}
                className={`w-full text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium`}
                style={{ backgroundColor: PRIMARY_COLOR }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = PRIMARY_COLOR_DARK;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = PRIMARY_COLOR;
                }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}