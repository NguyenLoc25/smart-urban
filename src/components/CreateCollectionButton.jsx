"use client";
import styles from './CreateCollectionButton.module.scss';
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

const CreateCollectionButton = ({ userId }) => {
  const router = useRouter();

  const handleCreate = async () => {
    const response = await fetch("/api/collection/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ label: "New Collection" }),
    });

    if (response.ok) {
      router.push(`/energy/settings`); // Điều hướng đến trang mới
    } else {
      console.error("Failed to create collection");
    }
  };

  return (
    <button className={styles.button} onClick={handleCreate}>
      <Plus className={styles.icon} /> Create new collection
    </button>
  );
};

export default CreateCollectionButton;
