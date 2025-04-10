"use client";
import CollectionEditor from "@/components/energy/CollectionEditor";

export default async function EditCollection({ params }) {
  const { id } = await params;

  return (
    <CollectionEditor id={id}/>
  );
}