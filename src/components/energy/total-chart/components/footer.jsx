const Footer = ({ mobile = false }) => (
    <div className={`mt-3 text-center ${mobile ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400`}>
      <p>Cập nhật: {new Date().toLocaleDateString('vi-VN')}</p>
    </div>
  )
  
  export default Footer