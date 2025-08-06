"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

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
    ctx.fillStyle = "#047857";
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
    ctx.fillStyle = "#047857";
    ctx.fillRect(0, 0, 60, 60);
    ctx.fillRect(140, 0, 60, 60);
    ctx.fillRect(0, 140, 60, 60);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(10, 10, 40, 40);
    ctx.fillRect(150, 10, 40, 40);
    ctx.fillRect(10, 150, 40, 40);

    ctx.fillStyle = "#047857";
    ctx.fillRect(20, 20, 20, 20);
    ctx.fillRect(160, 20, 20, 20);
    ctx.fillRect(20, 160, 20, 20);

    resolve(canvas.toDataURL());
  });
};

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
  const [smartBookingData, setSmartBookingData] = useState(null); // เก็บข้อมูลจาก response

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchDistricts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/districts`);
      const data = await response.json();
      setDistricts(
        data.filter((district) => district.province_name === "กรุงเทพมหานคร")
      );
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistricts([]);
    }
  };

  const fetchServices = async (districtId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/services?district_id=${districtId}`
      );
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    }
  };

  const fetchAvailableQueues = async (serviceId) => {
    try {
      // Get today's date
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `${API_BASE_URL}/queue/bookings?service_id=${serviceId}&booking_date=${today}`
      );
      const existingQueues = await response.json();

      // Generate available time slots (9:00 AM to 4:00 PM)
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
      console.error("Error fetching available queues:", error);
      setAvailableQueues([]);
    }
  };

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    const userMessage = { type: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

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
          province_name: serviceInfo.province
        });
      }

      const botMessage = {
        type: "bot",
        content: data.answer,
        timestamp: new Date(),
        showQueueButton: !!serviceInfo, // แสดงปุ่มเมื่อมีข้อมูลบริการ
        serviceInfo: serviceInfo // เก็บข้อมูลบริการใน message
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: "bot",
        content: "ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันจองคิวอัจฉริยะ - ใช้ข้อมูลจาก response โดยตรง
  const handleSmartQueueBooking = async () => {
    if (!smartBookingData) {
      alert("ไม่พบข้อมูลบริการ กรุณาถามเกี่ยวกับบริการที่ต้องการก่อน");
      return;
    }

    // ตั้งค่าเขตและบริการจาก smartBookingData
    setSelectedDistrict(smartBookingData.district_id.toString());
    setSelectedService(smartBookingData.service_id.toString());
    
    // ดึงข้อมูลเขตและบริการ
    await fetchDistricts();
    await fetchServices(smartBookingData.district_id);
    
    // ดึงช่วงเวลาที่ว่างสำหรับบริการนี้
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
      // ใช้ข้อมูลที่เลือกจาก dropdown
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
      };

      const response = await fetch(`${API_BASE_URL}/queue/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

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
      console.error("Error booking queue:", error);
      alert("เกิดข้อผิดพลาดในการจองคิว กรุณาลองใหม่");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Reset form
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 max-w-xl mx-auto">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center shadow-md">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">บริการประชาชน</h1>
              <p className="text-sm text-gray-600">กรุงเทพมหานคร</p>
            </div>
          </div>

          <button
            onClick={handleShowQueueStatus}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <QrCode className="w-4 h-4" />
            <span className="font-medium">ตรวจสอบคิว</span>
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Building className="w-12 h-12 text-white" />
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
                    className="p-4 rounded-xl shadow-sm border border-gray-200 hover:border-emerald-600 bg-white hover:shadow-md transition-all duration-200 text-left group"
                  >
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0 group-hover:text-emerald-700 transition-colors" />
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
          <div className="space-y-6 mb-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                <div className="flex items-start space-x-3 max-w-3xl">
                  {message.type === "bot" && (
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-5 py-4 shadow-md ${
                      message.type === "user"
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-gray-800 border border-gray-100"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    
                    {/* แสดงข้อมูลบริการจาก response */}
                    {message.serviceInfo && (
                      <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <div className="text-sm text-emerald-800 space-y-1">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">{message.serviceInfo.service}</span>
                          </div>
                          <div className="text-emerald-600">
                            {message.serviceInfo.district}, {message.serviceInfo.province}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-xs opacity-70 mt-3">
                      {message.timestamp.toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {message.showQueueButton && (
                      <button
                        onClick={handleSmartQueueBooking}
                        className="mt-4 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg font-medium"
                      >
                        <Clock className="w-4 h-4" />
                        <span>จองคิวบริการนี้</span>
                      </button>
                    )}
                  </div>

                  {message.type === "user" && (
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-md">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl px-5 py-4 shadow-md border border-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex space-x-4"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="พิมพ์คำถามของคุณ..."
              className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-white transition-all duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg font-medium"
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
              <h3 className="text-xl font-bold text-gray-800">
                จองคิว
              </h3>
              <button
                onClick={() => setShowQueueModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {smartBookingData ? (
              /* แสดงข้อมูลบริการที่เลือกจาก AI พร้อมให้เลือกเขตและบริการ */
              <div className="space-y-5">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="text-sm text-emerald-800 space-y-2">
                    <div className="text-center mb-2">
                      <span className="font-semibold">บริการที่แนะนำสำหรับคุณ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>บริการ:</span>
                      <span className="font-semibold">{smartBookingData.service_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>เขต:</span>
                      <span className="font-semibold">{smartBookingData.district_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>จังหวัด:</span>
                      <span className="font-semibold">{smartBookingData.province_name}</span>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white transition-all duration-200"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-50 disabled:bg-gray-50 bg-white transition-all duration-200"
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
                          className="p-3 border border-gray-300 rounded-xl hover:border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
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
              /* แสดงการเลือกเขตและบริการแบบเดิม */
              <div className="space-y-5">
                {/* District Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    เขต
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white transition-all duration-200"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-50 disabled:bg-gray-50 bg-white transition-all duration-200"
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
                          className="p-3 border border-gray-300 rounded-xl hover:border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all duration-200"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border">
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>เวลาที่เลือก:</span>
                    <span className="font-semibold text-emerald-600">
                      {selectedQueue?.display}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>วันที่:</span>
                    <span className="font-semibold text-emerald-600">
                      {new Date().toLocaleDateString("th-TH")}
                    </span>
                  </div>
                  {smartBookingData && (
                    <>
                      <div className="flex justify-between">
                        <span>บริการ:</span>
                        <span className="font-semibold text-emerald-600">
                          {smartBookingData.service_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>เขต:</span>
                        <span className="font-semibold text-emerald-600">
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
                  className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
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
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                จองคิวสำเร็จ!
              </h3>
              <p className="text-gray-600 mb-6">คุณได้รับหมายเลขคิว</p>

              <div className="bg-gray-50 p-5 rounded-xl mb-6 border">
                <div className="text-3xl font-bold text-emerald-600 mb-3">
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
                className="w-full bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
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
                <div className="text-3xl font-bold text-emerald-600 mb-3">
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
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        bookedQueue.status === "pending"
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
                className="w-full bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
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