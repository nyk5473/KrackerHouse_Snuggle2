/**
 * Cracker House X Snuggle Collaboration API Communication Module
 */
const API_BASE = "http://localhost:8000/api";

const ApiService = {
  // ── ☕ 팝업 및 체험존 정보 ──
  async getPopupInfo() {
    try {
      const response = await fetch(`${API_BASE}/popup`);
      if (!response.ok) throw new Error("팝업 정보를 불러오지 못했습니다.");
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async getPopupZones() {
    try {
      const response = await fetch(`${API_BASE}/popup/zones`);
      if (!response.ok) throw new Error("체험존 정보를 불러오지 못했습니다.");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // ── 👕 상품 정보 ──
  async getProducts(brand = null, category = null) {
    try {
      let url = `${API_BASE}/products?`;
      if (brand) url += `brand=${brand}&`;
      if (category) url += `category=${category}&`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("상품 정보를 불러오지 못했습니다.");
      return await response.json();
    } catch (error) {
      console.error(error);
      return { total: 0, items: [] };
    }
  },

  async getProductDetail(id) {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (!response.ok) throw new Error("상품 상세 정보를 불러오지 못했습니다.");
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // ── 📅 예약 및 현장 대기 ──
  async createPreReservation(name, phone, email, reservationDate, reservationTime, peopleCount) {
    try {
      const response = await fetch(`${API_BASE}/reservations/pre`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email || null,
          reservation_date: reservationDate,
          reservation_time: reservationTime,
          people_count: parseInt(peopleCount)
        })
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.detail || "예약에 실패했습니다." };
      }
      return { success: true, data };
    } catch (error) {
      console.error(error);
      return { success: false, message: "서버와의 통신 오류가 발생했습니다." };
    }
  },

  async createOnsiteReservation(name, phone, peopleCount) {
    try {
      const response = await fetch(`${API_BASE}/reservations/onsite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          people_count: parseInt(peopleCount)
        })
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.detail || "현장 대기 등록에 실패했습니다." };
      }
      return { success: true, data };
    } catch (error) {
      console.error(error);
      return { success: false, message: "서버와의 통신 오류가 발생했습니다." };
    }
  },

  async getWaitingStatus(phone) {
    try {
      const response = await fetch(`${API_BASE}/reservations/waiting-status/${phone}`);
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.detail || "대기 내역을 조회할 수 없습니다." };
      }
      return { success: true, data };
    } catch (error) {
      console.error(error);
      return { success: false, message: "대기 정보를 불러오는데 실패했습니다." };
    }
  },

  async getMyPreReservations(phone) {
    try {
      const response = await fetch(`${API_BASE}/reservations/my?phone=${phone}`);
      if (!response.ok) throw new Error("예약 내역 조회에 실패했습니다.");
      return await response.json();
    } catch (error) {
      console.error(error);
      return { total: 0, items: [] };
    }
  },

  // ── 📬 방명록 ──
  async getGuestbooks() {
    try {
      const response = await fetch(`${API_BASE}/guestbook`);
      if (!response.ok) throw new Error("방명록을 불러오지 못했습니다.");
      return await response.json();
    } catch (error) {
      console.error(error);
      return { total: 0, items: [] };
    }
  },

  async createGuestbook(nickname, message) {
    try {
      const response = await fetch(`${API_BASE}/guestbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, message })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "방명록 작성에 실패했습니다.");
      return { success: true, message: data.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message || "서버 통신 오류" };
    }
  },

  // ── 🧺 빨랫줄 (폴라로이드) ──
  async getLaundryPins() {
    try {
      const response = await fetch(`${API_BASE}/laundry-line`);
      if (!response.ok) throw new Error("빨랫줄 사진을 불러오지 못했습니다.");
      return await response.json();
    } catch (error) {
      console.error(error);
      return { total: 0, items: [] };
    }
  },

  async createLaundryPin(nickname, message, pinType, imageFile) {
    try {
      const formData = new FormData();
      formData.append("nickname", nickname);
      if (message) formData.append("message", message);
      formData.append("pin_type", pinType);
      formData.append("image", imageFile);

      const response = await fetch(`${API_BASE}/laundry-line`, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.detail || "업로드에 실패했습니다." };
      }
      return { success: true, message: data.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: "서버 통신 오류가 발생했습니다." };
    }
  },

  // ── 🔐 관리자 기능 (인증 토큰 필요) ──
  async adminLogin(email, password) {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.detail || "로그인 정보가 올바르지 않습니다." };
      }
      // 토큰 세션스토리지 저장
      sessionStorage.setItem("admin_token", data.access_token);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: "서버 통신 오류가 발생했습니다." };
    }
  },

  getAdminHeaders() {
    const token = sessionStorage.getItem("admin_token");
    return {
      "Authorization": `Bearer ${token}`
    };
  },

  async getPendingContent() {
    try {
      const response = await fetch(`${API_BASE}/admin/pending`, {
        headers: this.getAdminHeaders()
      });
      if (!response.ok) throw new Error("대기 콘텐츠 목록을 불러오지 못했습니다.");
      return await response.json();
    } catch (error) {
      console.error(error);
      return { total: 0, items: [] };
    }
  },

  async approveContent(type, id) {
    try {
      const response = await fetch(`${API_BASE}/admin/approve/${type}/${id}`, {
        method: "PATCH",
        headers: this.getAdminHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "승인 처리에 실패했습니다.");
      return { success: true, message: data.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  },

  async rejectContent(type, id) {
    // type이 pin이면 laundry-line에서 삭제, guestbook이면 guestbook에서 삭제
    try {
      const url = type === "pin" ? `${API_BASE}/laundry-line/${id}` : `${API_BASE}/guestbook/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: this.getAdminHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "삭제 처리에 실패했습니다.");
      return { success: true, message: data.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  },

  async getAdminStats() {
    try {
      const response = await fetch(`${API_BASE}/admin/stats`, {
        headers: this.getAdminHeaders()
      });
      if (!response.ok) throw new Error("관리자 통계를 가져오지 못했습니다.");
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async getAllReservations() {
    try {
      const response = await fetch(`${API_BASE}/reservations`, {
        headers: this.getAdminHeaders()
      });
      if (!response.ok) throw new Error("예약 목록을 불러오지 못했습니다.");
      return await response.json();
    } catch (error) {
      console.error(error);
      return { total: 0, items: [] };
    }
  },

  async updateReservationStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE}/reservations/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...this.getAdminHeaders()
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "예약 상태 변경에 실패했습니다.");
      return { success: true, data };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  }
};
