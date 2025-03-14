export type Call = {
  id: string;
  name: string;
  avatar: string;
  type: "incoming" | "outgoing" | "missed" | "video";
  timestamp: Date;
};

export type CallsScreenProps = {
  navigation?: any;
};
