const TotalProductionCard = ({ dailyData, equivalentHouseholds }) => (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-md p-5 text-white">
      <h3 className="font-medium text-base mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Tổng sản lượng
      </h3>
      <div className="text-2xl font-bold mb-1">
        {(dailyData.reduce((sum, day) => sum + day.production, 0) / 1000000).toFixed(2)} GWh
      </div>
      <div className="text-xs opacity-90">
        Tương đương {equivalentHouseholds.toLocaleString()} hộ gia đình
      </div>
    </div>
  );
  
  export default TotalProductionCard;