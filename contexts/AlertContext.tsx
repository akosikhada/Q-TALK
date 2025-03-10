import React, { createContext, useState, useContext, ReactNode } from "react";
import CustomAlert from "../components/CustomAlert";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertContextType {
  showAlert: (
    title: string,
    message: string,
    type?: AlertType,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
  showSuccessAlert: (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => void;
  showErrorAlert: (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => void;
  showWarningAlert: (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => void;
  showInfoAlert: (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => void;
  showConfirmAlert: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info" as AlertType,
    onConfirm: undefined as (() => void) | undefined,
    onCancel: undefined as (() => void) | undefined,
    confirmText: "OK",
    cancelText: "Cancel",
  });

  const showAlert = (
    title: string,
    message: string,
    type: AlertType = "info",
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText: string = "OK",
    cancelText: string = "Cancel"
  ) => {
    setAlertConfig({
      title,
      message,
      type,
      onConfirm,
      onCancel,
      confirmText,
      cancelText,
    });
    setVisible(true);
  };

  const showSuccessAlert = (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    showAlert(title, message, "success", onConfirm);
  };

  const showErrorAlert = (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    showAlert(title, message, "error", onConfirm);
  };

  const showWarningAlert = (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    showAlert(title, message, "warning", onConfirm);
  };

  const showInfoAlert = (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    showAlert(title, message, "info", onConfirm);
  };

  const showConfirmAlert = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText: string = "Yes",
    cancelText: string = "No"
  ) => {
    showAlert(
      title,
      message,
      "warning",
      onConfirm,
      onCancel,
      confirmText,
      cancelText
    );
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        showSuccessAlert,
        showErrorAlert,
        showWarningAlert,
        showInfoAlert,
        showConfirmAlert,
      }}
    >
      {children}
      <CustomAlert
        visible={visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onDismiss={handleDismiss}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
