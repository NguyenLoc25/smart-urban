import React from "react";
import CreateCollectionButton from "./CreateCollectionButton";

const PageHeader = ({ user, isSystemUser }) => (
  <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Bảng điều khiển năng lượng
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Theo dõi và quản lý các nguồn năng lượng của bạn
      </p>
    </div>

    {user && isSystemUser && (
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <CreateCollectionButton className="w-full sm:w-auto" />
      </div>
    )}
  </div>
);

export default PageHeader;