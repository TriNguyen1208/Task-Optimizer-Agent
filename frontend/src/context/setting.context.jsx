import { createContext, useContext, useState, useEffect } from "react";
import useSetting from "@/hooks/useSetting";

const SettingContext = createContext();


export const SettingProvider = ({ children }) => {
  const user = localStorage.getItem("user");

  const { data: setting, isLoading } = useSetting.getSetting(!!user);
  const { mutate: updateSetting } = useSetting.updateSetting();

  const [formData, setFormData] = useState({
    dark_mode: false,
    activate: false,
    auto_schedule: false,
    notifications: false
  });

  useEffect(() => {
    if (setting) {
      setFormData(setting);
    }
  }, [setting]);

  useEffect(() => {
    if (formData.dark_mode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [formData.dark_mode]);

  const handleToggle = (key) => {
      // 1. Tạo bản cập nhật mới
      const updatedValue = !formData[key];
      const newFormData = { ...formData, [key]: updatedValue };

      // 2. Cập nhật Local State ngay lập tức để UI mượt (Optimistic Update)
      setFormData(newFormData);

      // 3. Gửi lên Server
      updateSetting(newFormData);
  };

  const toggleTheme = (e) => {
    e?.stopPropagation();
    handleToggle("dark_mode");
  };

  const toggleAutoSchedule = (e) => {
    e?.stopPropagation();
    handleToggle("auto_schedule");
  };

  if (isLoading) {
    return null; 
  }

  return (
    <SettingContext.Provider 
      value={{ 
        isDarkMode: formData.dark_mode, 
        isAutoSchedule: formData.auto_schedule,
        toggleTheme, 
        toggleAutoSchedule,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};

export const useMode = () => useContext(SettingContext);