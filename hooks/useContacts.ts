import { useState } from "react";
import { Contact } from "../types/chat";

export const useContacts = (
  initialContacts: { title: string; data: Contact[] }[] = []
) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const getFilteredContacts = (
    contacts: { title: string; data: Contact[] }[]
  ) => {
    let filteredData = [...contacts];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData
        .map((section) => ({
          title: section.title,
          data: section.data.filter(
            (contact) =>
              contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (contact.phone && contact.phone.includes(searchQuery)) ||
              (contact.email &&
                contact.email.toLowerCase().includes(searchQuery.toLowerCase()))
          ),
        }))
        .filter((section) => section.data.length > 0);
    }

    // Apply category filter
    if (activeFilter !== "all") {
      if (activeFilter === "favorites") {
        filteredData = filteredData.filter(
          (section) =>
            section.title === "Favorites" ||
            section.data.some((contact) => contact.isFavorite)
        );
      }
    }

    return filteredData;
  };

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    getFilteredContacts,
  };
};
