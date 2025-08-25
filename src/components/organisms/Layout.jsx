import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main content */}
      <div className="lg:pl-64">
        <Header title={title} subtitle={subtitle} />
        <main className="px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;