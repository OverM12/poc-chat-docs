"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  Users,
  AlertTriangle,
  BarChart3,
  Calendar,
  MapPin,
  Building,
  Phone,
  CheckCircle,
  XCircle,
  Activity,
  PieChart,
  LineChart,
} from "lucide-react";
import Image from "next/image";
export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState("peak-hours");

  const peakHoursData = {
    daily: [
      { time: "09:00-10:00", count: 45, percentage: 18 },
      { time: "10:00-11:00", count: 52, percentage: 21 },
      { time: "11:00-12:00", count: 38, percentage: 15 },
      { time: "13:00-14:00", count: 41, percentage: 16 },
      { time: "14:00-15:00", count: 35, percentage: 14 },
      { time: "15:00-16:00", count: 32, percentage: 13 },
      { time: "16:00-17:00", count: 15, percentage: 6 },
    ],
    weekly: [
      { day: "จันทร์", count: 180, percentage: 15 },
      { day: "อังคาร", count: 220, percentage: 18 },
      { day: "พุธ", count: 250, percentage: 21 },
      { day: "พฤหัสบดี", count: 240, percentage: 20 },
      { day: "ศุกร์", count: 200, percentage: 17 },
      { day: "เสาร์", count: 80, percentage: 7 },
      { day: "อาทิตย์", count: 40, percentage: 3 },
    ],
    districts: [
      { district: "ดินแดง", peakTime: "10:00-11:00", count: 85 },
      { district: "ห้วยขวาง", peakTime: "09:00-10:00", count: 72 },
      { district: "วัฒนา", peakTime: "14:00-15:00", count: 68 },
      { district: "คลองเตย", peakTime: "11:00-12:00", count: 65 },
      { district: "ประเวศ", peakTime: "10:00-11:00", count: 58 },
    ],
  };

  const bookingBehaviorData = {
    advanceBooking: [
      { days: "1 วัน", count: 35, percentage: 35 },
      { days: "2-3 วัน", count: 28, percentage: 28 },
      { days: "4-7 วัน", count: 22, percentage: 22 },
      { days: "8-14 วัน", count: 12, percentage: 12 },
      { days: "15+ วัน", count: 3, percentage: 3 },
    ],
    cancellation: {
      rate: 12.5,
      reasons: [
        { reason: "ติดธุระ", percentage: 45 },
        { reason: "ลืม", percentage: 25 },
        { reason: "เปลี่ยนใจ", percentage: 20 },
        { reason: "อื่นๆ", percentage: 10 },
      ],
    },
    channels: [
      { channel: "แอปพลิเคชัน", count: 65, percentage: 65 },
      { channel: "เว็บไซต์", count: 25, percentage: 25 },
      { channel: "เคาน์เตอร์", count: 8, percentage: 8 },
      { channel: "โทรศัพท์", count: 2, percentage: 2 },
    ],
    walkInVsBooking: {
      walkIn: 30,
      preBooking: 70,
    },
  };

  const serviceReadinessData = {
    districts: [
      {
        district: "ดินแดง",
        counters: 8,
        staff: 12,
        hours: "08:30-16:30",
        avgWaitTime: "25 นาที",
        capacity: "85%",
      },
      {
        district: "ห้วยขวาง",
        counters: 6,
        staff: 10,
        hours: "08:30-16:30",
        avgWaitTime: "30 นาที",
        capacity: "92%",
      },
      {
        district: "วัฒนา",
        counters: 10,
        staff: 15,
        hours: "08:30-16:30",
        avgWaitTime: "20 นาที",
        capacity: "78%",
      },
      {
        district: "คลองเตย",
        counters: 7,
        staff: 11,
        hours: "08:30-16:30",
        avgWaitTime: "35 นาที",
        capacity: "88%",
      },
      {
        district: "ประเวศ",
        counters: 5,
        staff: 8,
        hours: "08:30-16:30",
        avgWaitTime: "40 นาที",
        capacity: "95%",
      },
    ],
    totalStats: {
      totalCounters: 36,
      totalStaff: 56,
      avgCapacity: 88,
    },
  };

  const problemsData = {
    complaints: [
      {
        district: "ประเวศ",
        issue: "รอคิวนาน",
        count: 25,
        avgWaitTime: "45 นาที",
        severity: "สูง",
      },
      {
        district: "คลองเตย",
        issue: "เจ้าหน้าที่ไม่เพียงพอ",
        count: 18,
        avgWaitTime: "35 นาที",
        severity: "ปานกลาง",
      },
      {
        district: "ห้วยขวาง",
        issue: "ระบบล่ม",
        count: 12,
        avgWaitTime: "30 นาที",
        severity: "ปานกลาง",
      },
      {
        district: "ดินแดง",
        issue: "ข้อมูลไม่ครบถ้วน",
        count: 8,
        avgWaitTime: "25 นาที",
        severity: "ต่ำ",
      },
      {
        district: "วัฒนา",
        issue: "การสื่อสารไม่ชัดเจน",
        count: 6,
        avgWaitTime: "20 นาที",
        severity: "ต่ำ",
      },
    ],
    skippedQueues: {
      total: 45,
      reasons: [
        { reason: "รอไม่ไหว", count: 20 },
        { reason: "ติดธุระ", count: 15 },
        { reason: "เปลี่ยนใจ", count: 10 },
      ],
    },
    avgServiceTime: "28 นาที",
    satisfactionRate: 78,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-4 flex flex-row items-center justify-between">
          {/* ซ้าย: ปุ่มกลับ + โลโก้และชื่อ */}
          <div className="flex-1 flex items-center justify-between">
            {/* ปุ่มกลับ */}
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-xs xs:text-sm sm:text-base">กลับหน้าหลัก</span>
            </Link>
            {/* โลโก้และชื่อ อยู่ตรงกลาง */}
            <div className="flex flex-col items-end flex-1">
              <div className="flex items-center space-x-2 xs:space-x-3">
                <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Image src="/bk-logo.png" alt="logo" width={500} height={500} className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8" />
                </div>
                <div className="text-left">
                  <h1 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800">ข้อมูลเชิงลึก</h1>
                  <p className="text-xs xs:text-sm sm:text-sm text-gray-600">กรุงเทพมหานคร</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 xs:py-4 sm:py-6">
        {/* Tab Navigation */}
        {/* Responsive Tab Navigation: row on desktop, dropdown on mobile */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          {/* Mobile: Dropdown */}
          <div className="block sm:hidden border-b border-gray-200">
            <select
              className="w-full px-2 xs:px-3 py-2 xs:py-3 text-sm xs:text-base border-0 bg-transparent focus:ring-0"
              value={activeTab}
              onChange={e => setActiveTab(e.target.value)}
            >
              <option value="peak-hours">⏰ เวลา Peak</option>
              <option value="booking-behavior">📈 พฤติกรรม</option>
              <option value="service-readiness">🏢 ความพร้อม</option>
              <option value="problems">⚠️ ปัญหา</option>
            </select>
          </div>
          {/* Desktop: Horizontal Tabs */}
          <div className="hidden sm:flex flex-row border-b border-gray-200">
            <button
              onClick={() => setActiveTab("peak-hours")}
              className={`flex-1 px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4 text-center font-medium transition-colors text-sm xs:text-base ${
                activeTab === "peak-hours"
                  ? "text-[#4393d9] border-b-2 border-[#4393d9] bg-[#e8f2ff]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center space-x-1 xs:space-x-2">
                <Clock className="w-5 h-5" />
                <span>เวลาใช้งานหนาแน่น</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("booking-behavior")}
              className={`flex-1 px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4 text-center font-medium transition-colors text-sm xs:text-base ${
                activeTab === "booking-behavior"
                  ? "text-[#4393d9] border-b-2 border-[#4393d9] bg-[#e8f2ff]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center space-x-1 xs:space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>พฤติกรรมการจองคิว</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("service-readiness")}
              className={`flex-1 px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4 text-center font-medium transition-colors text-sm xs:text-base ${
                activeTab === "service-readiness"
                  ? "text-[#4393d9] border-b-2 border-[#4393d9] bg-[#e8f2ff]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center space-x-1 xs:space-x-2">
                <Building className="w-5 h-5" />
                <span>ความพร้อมของหน่วยบริการ</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("problems")}
              className={`flex-1 px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4 text-center font-medium transition-colors text-sm xs:text-base ${
                activeTab === "problems"
                  ? "text-[#4393d9] border-b-2 border-[#4393d9] bg-[#e8f2ff]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center space-x-1 xs:space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>ปัญหาหรือข้อร้องเรียน</span>
              </div>
            </button>
          </div>
        </div>

        {/* Peak Hours Tab */}
        {activeTab === "peak-hours" && (
          <div className="space-y-3 xs:space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-2 xs:p-3 sm:p-6">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 mb-3 xs:mb-4 sm:mb-6 flex items-center space-x-1 xs:space-x-2 sm:space-x-3">
                <Clock className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-[#4393d9]" />
                <span>เวลาใช้งานหนาแน่น (Peak Hours)</span>
              </h2>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-6">
                ข้อมูลแสดงช่วงเวลาที่มีการจองคิวสูงสุดในแต่ละพื้นที่ และวันในสัปดาห์ที่มีผู้ใช้บริการมากที่สุด
              </p>

              {/* Daily Peak Hours */}
              <div className="mb-4 xs:mb-6 sm:mb-8">
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">ช่วงเวลาในแต่ละวัน</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
                  {peakHoursData.daily.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-[#e8f2ff] to-blue-50 rounded-xl p-2 xs:p-3 sm:p-4 border border-[#4393d9]"
                    >
                      <div className="flex justify-between items-center mb-1 xs:mb-2">
                        <span className="font-semibold text-gray-800 text-xs xs:text-sm sm:text-base">{item.time}</span>
                        <span className="text-[#4393d9] font-bold text-xs xs:text-sm sm:text-base">{item.count} คน</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#4393d9] to-blue-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs xs:text-xs sm:text-sm text-gray-600 mt-1 xs:mt-2">{item.percentage}% ของการจองทั้งหมด</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Distribution */}
              <div className="mb-4 xs:mb-6 sm:mb-8">
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">การกระจายในแต่ละวัน</h3>
                <div className="grid grid-cols-2 xs:grid-cols-4 md:grid-cols-7 gap-1 xs:gap-2 sm:gap-3">
                  {peakHoursData.weekly.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-2 xs:p-3 sm:p-4 border border-gray-200 text-center"
                    >
                      <div className="text-sm xs:text-base sm:text-lg font-bold text-[#4393d9] mb-0.5 xs:mb-1">{item.count}</div>
                      <div className="text-xs xs:text-xs sm:text-sm font-medium text-gray-800 mb-0.5 xs:mb-1">{item.day}</div>
                      <div className="text-xs text-gray-600">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* District Comparison */}
              <div>
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">เปรียบเทียบเวลา Peak ของแต่ละเขต</h3>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl shadow-sm min-w-[400px]">
                    <thead className="bg-[#e8f2ff]">
                      <tr>
                        <th className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-left text-xs xs:text-sm font-semibold text-gray-800">เขต</th>
                        <th className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-left text-xs xs:text-sm font-semibold text-gray-800">เวลา Peak</th>
                        <th className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-left text-xs xs:text-sm font-semibold text-gray-800">จำนวนการจอง</th>
                      </tr>
                    </thead>
                    <tbody>
                      {peakHoursData.districts.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-xs xs:text-sm text-gray-800 font-medium">{item.district}</td>
                          <td className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-xs xs:text-sm text-[#4393d9] font-semibold">{item.peakTime}</td>
                          <td className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-xs xs:text-sm text-gray-600">{item.count} คน</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Behavior Tab */}
        {activeTab === "booking-behavior" && (
          <div className="space-y-3 xs:space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-2 xs:p-3 sm:p-6">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 mb-3 xs:mb-4 sm:mb-6 flex items-center space-x-1 xs:space-x-2 sm:space-x-3">
                <TrendingUp className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-[#4393d9]" />
                <span>พฤติกรรมการจองคิว</span>
              </h2>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-6">
                ข้อมูลแสดงพฤติกรรมการจองคิว เช่น การจองล่วงหน้า การยกเลิกคิว ช่องทางที่ใช้จอง และการเปรียบเทียบ Walk-in vs จองล่วงหน้า
              </p>

              {/* Advance Booking */}
              <div className="mb-4 xs:mb-6 sm:mb-8">
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">การจองล่วงหน้า</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 xs:gap-3 sm:gap-4">
                  {bookingBehaviorData.advanceBooking.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-[#e8f2ff] to-blue-50 rounded-xl p-2 xs:p-3 sm:p-4 border border-[#4393d9] text-center"
                    >
                      <div className="text-lg xs:text-xl sm:text-2xl font-bold text-[#4393d9] mb-0.5 xs:mb-1">{item.count}%</div>
                      <div className="text-xs xs:text-xs sm:text-sm font-medium text-gray-800 mb-0.5 xs:mb-1">{item.days}</div>
                      <div className="text-xs text-gray-600">{item.percentage}% ของผู้ใช้</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancellation Rate */}
              <div className="mb-4 xs:mb-6 sm:mb-8">
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">อัตราการยกเลิกคิว</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 xs:gap-4 sm:gap-6">
                  <div className="bg-red-50 rounded-xl p-2 xs:p-4 sm:p-6 border border-red-200">
                    <div className="text-center">
                      <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-red-600 mb-1 xs:mb-2">{bookingBehaviorData.cancellation.rate}%</div>
                      <div className="text-sm xs:text-base sm:text-lg font-medium text-gray-800">อัตราการยกเลิก</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-2 xs:p-4 sm:p-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">สาเหตุการยกเลิก</h4>
                    <div className="space-y-1 xs:space-y-2 sm:space-y-3">
                      {bookingBehaviorData.cancellation.reasons.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-xs xs:text-sm text-gray-700">{item.reason}</span>
                          <span className="text-xs xs:text-sm font-semibold text-red-600">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Channels */}
              <div className="mb-4 xs:mb-6 sm:mb-8">
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">ช่องทางที่ใช้จอง</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
                  {bookingBehaviorData.channels.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-[#e8f2ff] to-blue-50 rounded-xl p-2 xs:p-3 sm:p-4 border border-[#4393d9] text-center"
                    >
                      <div className="text-lg xs:text-xl sm:text-2xl font-bold text-[#4393d9] mb-0.5 xs:mb-1">{item.count}%</div>
                      <div className="text-xs xs:text-xs sm:text-sm font-medium text-gray-800 mb-0.5 xs:mb-1">{item.channel}</div>
                      <div className="text-xs text-gray-600">{item.percentage}% ของผู้ใช้</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Walk-in vs Pre-booking */}
              <div>
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Walk-in vs จองล่วงหน้า</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 xs:gap-4 sm:gap-6">
                  <div className="bg-orange-50 rounded-xl p-2 xs:p-4 sm:p-6 border border-orange-200 text-center">
                    <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-orange-600 mb-1 xs:mb-2">{bookingBehaviorData.walkInVsBooking.walkIn}%</div>
                    <div className="text-sm xs:text-base sm:text-lg font-medium text-gray-800">Walk-in</div>
                    <div className="text-xs xs:text-sm text-gray-600 mt-1 xs:mt-2">ผู้ที่มาโดยไม่จองล่วงหน้า</div>
                  </div>
                  <div className="bg-[#e8f2ff] rounded-xl p-2 xs:p-4 sm:p-6 border border-[#4393d9] text-center">
                    <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#4393d9] mb-1 xs:mb-2">{bookingBehaviorData.walkInVsBooking.preBooking}%</div>
                    <div className="text-sm xs:text-base sm:text-lg font-medium text-gray-800">จองล่วงหน้า</div>
                    <div className="text-xs xs:text-sm text-gray-600 mt-1 xs:mt-2">ผู้ที่จองล่วงหน้า</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Readiness Tab */}
        {activeTab === "service-readiness" && (
          <div className="space-y-3 xs:space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-2 xs:p-3 sm:p-6">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 mb-3 xs:mb-4 sm:mb-6 flex items-center space-x-1 xs:space-x-2 sm:space-x-3">
                <Building className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-[#4393d9]" />
                <span>ความพร้อมของหน่วยบริการ</span>
              </h2>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-6">
                ข้อมูลแสดงจำนวนช่องให้บริการ จำนวนเจ้าหน้าที่ เวลาทำการ และความสามารถในการให้บริการของแต่ละพื้นที่
              </p>

              {/* Overall Statistics */}
              <div className="mb-4 xs:mb-6 sm:mb-8">
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">สถิติรวม</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 xs:gap-4 sm:gap-6">
                  <div className="bg-gradient-to-r from-[#e8f2ff] to-blue-50 rounded-xl p-2 xs:p-4 sm:p-6 border border-[#4393d9] text-center">
                    <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#4393d9] mb-1 xs:mb-2">{serviceReadinessData.totalStats.totalCounters}</div>
                    <div className="text-sm xs:text-base sm:text-lg font-medium text-gray-800">ช่องให้บริการ</div>
                    <div className="text-xs xs:text-sm text-gray-600 mt-1 xs:mt-2">รวมทั้งหมด</div>
                  </div>
                  <div className="bg-gradient-to-r from-[#e8f2ff] to-blue-50 rounded-xl p-2 xs:p-4 sm:p-6 border border-[#4393d9] text-center">
                    <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#4393d9] mb-1 xs:mb-2">{serviceReadinessData.totalStats.totalStaff}</div>
                    <div className="text-sm xs:text-base sm:text-lg font-medium text-gray-800">เจ้าหน้าที่</div>
                    <div className="text-xs xs:text-sm text-gray-600 mt-1 xs:mt-2">รวมทั้งหมด</div>
                  </div>
                  <div className="bg-gradient-to-r from-[#e8f2ff] to-blue-50 rounded-xl p-2 xs:p-4 sm:p-6 border border-[#4393d9] text-center xs:col-span-2 md:col-span-1">
                    <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#4393d9] mb-1 xs:mb-2">{serviceReadinessData.totalStats.avgCapacity}%</div>
                    <div className="text-sm xs:text-base sm:text-lg font-medium text-gray-800">ความสามารถเฉลี่ย</div>
                    <div className="text-xs xs:text-sm text-gray-600 mt-1 xs:mt-2">การให้บริการ</div>
                  </div>
                </div>
              </div>

              {/* District Details */}
              <div>
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">รายละเอียดแต่ละเขต</h3>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl shadow-sm min-w-[500px]">
                    <thead className="bg-[#e8f2ff]">
                      <tr>
                        <th className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-left text-xs xs:text-sm font-semibold text-gray-800">เขต</th>
                        <th className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-left text-xs xs:text-sm font-semibold text-gray-800">ช่องให้บริการ</th>
                        <th className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-left text-xs xs:text-sm font-semibold text-gray-800">เจ้าหน้าที่</th>
                        <th className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-left text-xs xs:text-sm font-semibold text-gray-800">เวลาทำการ</th>
                        <th className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-left text-xs xs:text-sm font-semibold text-gray-800">เวลารอเฉลี่ย</th>
                        <th className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-left text-xs xs:text-sm font-semibold text-gray-800">ความสามารถ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceReadinessData.districts.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-xs xs:text-sm text-gray-800 font-medium">{item.district}</td>
                          <td className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-xs xs:text-sm text-[#4393d9] font-semibold">{item.counters} ช่อง</td>
                          <td className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-xs xs:text-sm text-[#4393d9] font-semibold">{item.staff} คน</td>
                          <td className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-xs xs:text-sm text-gray-600">{item.hours}</td>
                          <td className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-xs xs:text-sm text-orange-600 font-semibold">{item.avgWaitTime}</td>
                          <td className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                parseInt(item.capacity) > 90
                                  ? "bg-red-100 text-red-800"
                                  : parseInt(item.capacity) > 80
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.capacity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Problems Tab */}
        {activeTab === "problems" && (
          <div className="space-y-3 xs:space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-2 xs:p-3 sm:p-6">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 mb-3 xs:mb-4 sm:mb-6 flex items-center space-x-1 xs:space-x-2 sm:space-x-3">
                <AlertTriangle className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-[#4393d9]" />
                <span>ปัญหาหรือข้อร้องเรียน</span>
              </h2>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-6">
                ข้อมูลแสดงปัญหาหรือข้อร้องเรียนที่เกิดขึ้น เช่น การรอคิวนาน ความล่าช้าในการให้บริการ และการข้ามคิว
              </p>

              {/* Overall Statistics */}
              <div className="mb-4 xs:mb-6 sm:mb-8">
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">สถิติรวม</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-4 sm:gap-6">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-2 xs:p-4 sm:p-6 border border-red-200 text-center">
                    <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-red-600 mb-1 xs:mb-2">{problemsData.complaints.length}</div>
                    <div className="text-sm xs:text-base sm:text-lg font-medium text-gray-800">ประเภทปัญหา</div>
                    <div className="text-xs xs:text-sm text-gray-600 mt-1 xs:mt-2">ที่พบ</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-2 xs:p-4 sm:p-6 border border-orange-200 text-center">
                    <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-orange-600 mb-1 xs:mb-2">{problemsData.skippedQueues.total}</div>
                    <div className="text-sm xs:text-base sm:text-lg font-medium text-gray-800">คิวที่ข้าม</div>
                    <div className="text-xs xs:text-sm text-gray-600 mt-1 xs:mt-2">รวมทั้งหมด</div>
                  </div>
                  <div className="bg-gradient-to-r from-[#e8f2ff] to-blue-50 rounded-xl p-2 xs:p-4 sm:p-6 border border-[#4393d9] text-center">
                    <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#4393d9] mb-1 xs:mb-2">{problemsData.avgServiceTime}</div>
                    <div className="text-sm xs:text-base sm:text-lg font-medium text-gray-800">เวลาบริการเฉลี่ย</div>
                    <div className="text-xs xs:text-sm text-gray-600 mt-1 xs:mt-2">ต่อคิว</div>
                  </div>
                  <div className="bg-gradient-to-r from-[#e8f2ff] to-blue-50 rounded-xl p-2 xs:p-4 sm:p-6 border border-[#4393d9] text-center xs:col-span-2 md:col-span-1">
                    <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#4393d9] mb-1 xs:mb-2">{problemsData.satisfactionRate}%</div>
                    <div className="text-sm xs:text-base sm:text-lg font-medium text-gray-800">ความพึงพอใจ</div>
                    <div className="text-xs xs:text-sm text-gray-600 mt-1 xs:mt-2">ของผู้ใช้</div>
                  </div>
                </div>
              </div>

              {/* Complaints by District */}
              <div className="mb-4 xs:mb-6 sm:mb-8">
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">ข้อร้องเรียนตามเขต</h3>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl shadow-sm min-w-[500px]">
                    <thead className="bg-red-50">
                      <tr>
                        <th className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-left text-xs xs:text-sm font-semibold text-gray-800">เขต</th>
                        <th className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-left text-xs xs:text-sm font-semibold text-gray-800">ปัญหา</th>
                        <th className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-left text-xs xs:text-sm font-semibold text-gray-800">จำนวน</th>
                        <th className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-left text-xs xs:text-sm font-semibold text-gray-800">เวลารอเฉลี่ย</th>
                        <th className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-left text-xs xs:text-sm font-semibold text-gray-800">ความรุนแรง</th>
                      </tr>
                    </thead>
                    <tbody>
                      {problemsData.complaints.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-xs xs:text-sm text-gray-800 font-medium">{item.district}</td>
                          <td className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-xs xs:text-sm text-gray-700">{item.issue}</td>
                          <td className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-xs xs:text-sm text-red-600 font-semibold">{item.count} ครั้ง</td>
                          <td className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3 text-xs xs:text-sm text-orange-600 font-semibold">{item.avgWaitTime}</td>
                          <td className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 sm:py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.severity === "สูง"
                                  ? "bg-red-100 text-red-800"
                                  : item.severity === "ปานกลาง"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.severity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Skipped Queues */}
              <div>
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">สาเหตุการข้ามคิว</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 xs:gap-3 sm:gap-4">
                  {problemsData.skippedQueues.reasons.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-2 xs:p-3 sm:p-4 border border-orange-200 text-center"
                    >
                      <div className="text-lg xs:text-xl sm:text-2xl font-bold text-orange-600 mb-0.5 xs:mb-1">{item.count}</div>
                      <div className="text-xs xs:text-xs sm:text-sm font-medium text-gray-800 mb-0.5 xs:mb-1">{item.reason}</div>
                      <div className="text-xs text-gray-600">{((item.count / problemsData.skippedQueues.total) * 100).toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
