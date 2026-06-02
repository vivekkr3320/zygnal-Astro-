"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompatibilityOnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  
  // Person 1 State
  const [name1, setName1] = useState("");
  const [email1, setEmail1] = useState("");
  const [month1, setMonth1] = useState("10");
  const [day1, setDay1] = useState("11");
  const [year1, setYear1] = useState("1996");

  // Person 2 State
  const [name2, setName2] = useState("");
  const [month2, setMonth2] = useState("4");
  const [day2, setDay2] = useState("15");
  const [year2, setYear2] = useState("1994");

  const [orderId, setOrderId] = useState("");
  const [paymentRecordId, setPaymentRecordId] = useState("");
  const [reportToken, setReportToken] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  const [pollingStatus, setPollingStatus] = useState("");

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name1 || !name2) return;
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 14900, // ₹149 for compatibility report
          email: email1 || "user@example.com",
          reportType: "SYNASTRY",
          birthData: { month: Number(month1), day: Number(day1), year: Number(year1), hour: 12, minute: 0, ampm: "PM" },
          partnerData: { month: Number(month2), day: Number(day2), year: Number(year2), hour: 12, minute: 0, ampm: "PM" }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      
      setOrderId(data.orderId);
      setPaymentRecordId(data.paymentRecordId);
      setReportToken(data.reportToken);
      setIsMockMode(data.mock);
      
      setStep(2);
    } catch {
      alert("Failed to create order");
    }
  };

  const pollReportStatus = (token: string) => {
    setPollingStatus("Synthesizing Cosmic Dynamics");
    setStep(3);
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/reports/status?token=${token}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "COMPLETED") {
            clearInterval(interval);
            router.push(`/compatibility/report/${token}`);
          }
        }
      } catch (err) { console.error(err); }
    }, 2000);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaymentProcessing(true);
    try {
      if (isMockMode) {
        await fetch("/api/payments/mock-capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentRecordId, orderId, token: reportToken }),
        });
        pollReportStatus(reportToken);
      } else {
        const rp = (window as any).Razorpay;
        const rzp = new rp({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: 14900, currency: "INR",
          name: "Zygnal Astro", description: "Synastry Compatibility Report",
          order_id: orderId,
          handler: async (response: any) => {
            try {
              await fetch("/api/payments/mock-capture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentRecordId, orderId, token: reportToken }),
              });
            } catch (err) { console.error(err); }
            pollReportStatus(reportToken);
          },
          prefill: { email: email1 },
          theme: { color: "#d4af37" },
        });
        rzp.open();
      }
    } catch (err) {
      alert("Payment processing error.");
      setIsPaymentProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-[#0a0814]/80 backdrop-blur-xl border border-[#d4af37]/20 p-8 rounded-lg">
      <h2 className="text-3xl font-serif text-[#d4af37] text-center mb-6">Cosmic Compatibility</h2>
      
      {step === 1 && (
        <form onSubmit={handleCreateOrder} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 border border-[#d4af37]/10 p-4 rounded bg-white/5">
              <h3 className="text-xl font-serif text-white">Person 1</h3>
              <input required value={name1} onChange={e=>setName1(e.target.value)} placeholder="Name" className="w-full bg-black/30 border border-white/10 p-3 rounded text-white" />
              <input required type="email" value={email1} onChange={e=>setEmail1(e.target.value)} placeholder="Email" className="w-full bg-black/30 border border-white/10 p-3 rounded text-white" />
              <div className="flex gap-2">
                <input required value={month1} onChange={e=>setMonth1(e.target.value)} placeholder="MM" className="w-1/3 bg-black/30 border border-white/10 p-3 rounded text-white" />
                <input required value={day1} onChange={e=>setDay1(e.target.value)} placeholder="DD" className="w-1/3 bg-black/30 border border-white/10 p-3 rounded text-white" />
                <input required value={year1} onChange={e=>setYear1(e.target.value)} placeholder="YYYY" className="w-1/3 bg-black/30 border border-white/10 p-3 rounded text-white" />
              </div>
            </div>
            
            <div className="space-y-4 border border-[#d4af37]/10 p-4 rounded bg-white/5">
              <h3 className="text-xl font-serif text-white">Person 2</h3>
              <input required value={name2} onChange={e=>setName2(e.target.value)} placeholder="Name" className="w-full bg-black/30 border border-white/10 p-3 rounded text-white" />
              <div className="flex gap-2">
                <input required value={month2} onChange={e=>setMonth2(e.target.value)} placeholder="MM" className="w-1/3 bg-black/30 border border-white/10 p-3 rounded text-white" />
                <input required value={day2} onChange={e=>setDay2(e.target.value)} placeholder="DD" className="w-1/3 bg-black/30 border border-white/10 p-3 rounded text-white" />
                <input required value={year2} onChange={e=>setYear2(e.target.value)} placeholder="YYYY" className="w-1/3 bg-black/30 border border-white/10 p-3 rounded text-white" />
              </div>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#d4af37] text-black font-bold p-4 rounded hover:bg-[#b08e2d] transition-all">
            Synthesize Connection (₹149)
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePayment} className="space-y-6">
           <h3 className="text-xl font-serif text-white text-center">Secure Checkout (₹149)</h3>
           <div className="space-y-4 max-w-sm mx-auto">
             <input required value={cardNumber} onChange={e=>setCardNumber(e.target.value)} placeholder="Card Number" className="w-full bg-black/30 border border-white/10 p-3 rounded text-white" />
             <div className="flex gap-4">
               <input required value={cardExpiry} onChange={e=>setCardExpiry(e.target.value)} placeholder="MM/YY" className="w-1/2 bg-black/30 border border-white/10 p-3 rounded text-white" />
               <input required value={cardCVC} onChange={e=>setCardCVC(e.target.value)} placeholder="CVC" className="w-1/2 bg-black/30 border border-white/10 p-3 rounded text-white" />
             </div>
           </div>
           <button type="submit" disabled={isPaymentProcessing} className="w-full max-w-sm mx-auto block bg-[#d4af37] text-black font-bold p-4 rounded hover:bg-[#b08e2d] transition-all">
             {isPaymentProcessing ? "Processing..." : "Complete Payment"}
           </button>
        </form>
      )}

      {step === 3 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-serif text-white animate-pulse">{pollingStatus}</h3>
          <p className="text-[#d4af37]/60 mt-4">Queued in worker pipeline...</p>
        </div>
      )}
    </div>
  );
}
