'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">⚙️ Cài đặt khu vườn</h1>

      {/* ===== CÀI ĐẶT HỆ THỐNG ===== */}
      <Card>
        <CardHeader className="text-lg font-semibold">⚙️ Cài đặt hệ thống</CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="gardenName">Tên khu vườn</Label>
            <Input id="gardenName" placeholder="Vườn ban công nhà mình" />
          </div>

          <div>
            <Label htmlFor="location">Vị trí (tuỳ chọn)</Label>
            <Input id="location" placeholder="Hà Nội, Việt Nam" />
          </div>

          <div>
            <Label>Chế độ hệ thống</Label>
            <Select defaultValue="auto">
              <SelectTrigger className="w-[200px]" />
              <SelectContent>
                <SelectItem value="auto">Tự động</SelectItem>
                <SelectItem value="manual">Thủ công</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
              🔁 Khởi động lại hệ thống
            </Button>
            <Button variant="destructive" className="hover:bg-red-700">
              🧯 Khôi phục mặc định
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ===== GIAO DIỆN CÁ NHÂN ===== */}
      <Card>
        <CardHeader className="text-lg font-semibold">👤 Giao diện cá nhân</CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="displayName">Tên hiển thị</Label>
            <Input id="displayName" placeholder="Nhập tên bạn..." />
          </div>

          <div>
            <Label>Chủ đề màu</Label>
            <Select defaultValue="light">
              <SelectTrigger className="w-[200px]" />
              <SelectContent>
                <SelectItem value="light">Chế độ sáng</SelectItem>
                <SelectItem value="dark">Chế độ tối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Đơn vị nhiệt độ</Label>
            <Select defaultValue="C">
              <SelectTrigger className="w-[200px]" />
              <SelectContent>
                <SelectItem value="C">°C</SelectItem>
                <SelectItem value="F">°F</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Ngôn ngữ</Label>
            <Select defaultValue="vi">
              <SelectTrigger className="w-[200px]" />
              <SelectContent>
                <SelectItem value="vi">Tiếng Việt</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ===== THÔNG BÁO & TÍCH HỢP ===== */}
      <Card>
        <CardHeader className="text-lg font-semibold">🔔 Thông báo & tích hợp</CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Âm báo khi vượt ngưỡng</Label>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <Label>Gửi email cảnh báo</Label>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label>Tích hợp Telegram Bot</Label>
            <Button variant="outline" className="text-blue-500 border-blue-400 hover:bg-blue-50">
              Kết nối
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ===== NÚT LƯU ===== */}
      <div className="text-right">
        <Button className="bg-green-600 hover:bg-green-700">
          💾 Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}

