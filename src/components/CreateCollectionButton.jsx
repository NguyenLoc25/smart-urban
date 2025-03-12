"use client";
import styles from './CreateCollectionButton.module.scss';
import { useRouter } from "next/navigation";
// import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const CreateCollectionButton = ({ userId }) => {
  const router = useRouter();

  const handleCreate = async () => {
    // Create a new collection
    const response = await fetch("/api/collection/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ label: "New Collection" }),
    });

    if (response.ok) {
      const { collectionId } = await response.json();
      // Redirect to the edit page for the new collection
      router.push(`/manage-form/${collectionId}`); // Chuyển hướng trước
      // router.push('/success'); // Chuyển hướng đến success sau đó
    } else {
      console.error("Failed to create collection");
    }
  };

//   const handleSubmit = async (data) => {
//     // Handle form submission with data
//     const response = await fetch("/api/form/submit", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       // Redirect to the success page after submission
//       router.push('/success');
//     } else {
//       console.error("Failed to submit form");
//     }
//   };


  return (
    <button className={styles.button} onClick={handleCreate}>
      <Plus className={styles.icon} /> Create new collection
    </button>
  );
  };

export default CreateCollectionButton;

// return (
//   <button className={styles.button} onClick={handleCreate}>
//     <Plus className={styles.icon} /> Create new collection
//   </button>
// );
// };

// return (
//   <Button onClick={handleCreate}>
//     <Plus /> Create new collection
//   </Button>
// );
// };