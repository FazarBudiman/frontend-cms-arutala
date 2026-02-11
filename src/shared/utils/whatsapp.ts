export const generateWhatsAppNumber = (phoneNumber: string) => {
  const WaPhone = phoneNumber.replace(/\s+/g, "").replace(/-/g, "").replace(/^\+/, "").replace(/^0/, "62");
  return WaPhone;
};

export const generateWhatsAppMessage = (senderName: string) => {
  const message = encodeURIComponent(`Halo ${senderName},\nSebelumnya, terima kasih sudah menghubungi arutala`);
  return message;
};
