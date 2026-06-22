import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";

export default function MainLayout({
    activeSection,
    menuItems,
    onMenuClick,
    onAddMenu,
    onRemoveMenu,
    searchValue,
    onSearchChange,
    pageTitle,
    pageBreadcrumb,
    onLogout,
    children,
}) {
    return (
        <div className="min-h-screen w-full bg-latar font-poppins text-teks">
            <div className="flex min-h-screen w-full flex-col lg:flex-row">
                <Sidebar
                    activeSection={activeSection}
                    menuItems={menuItems}
                    onMenuClick={onMenuClick}
                    onAddMenu={onAddMenu}
                    onRemoveMenu={onRemoveMenu}
                />

                <main className="min-w-0 flex-1 p-4 md:p-6 xl:p-8">
                    <Header
                        searchValue={searchValue}
                        onSearchChange={onSearchChange}
                    />
                    <div className="mt-6 min-w-0 space-y-6">
                        <div className="flex items-center justify-between">
                            <PageHeader
                                title={pageTitle}
                                subtitle={pageBreadcrumb}
                                actionLabel="Add Button"
                            />
                            {onLogout && (
                                <button
                                    onClick={onLogout}
                                    className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded border border-red-300 hover:border-red-500 transition"
                                >
                                    Logout
                                </button>
                            )}
                        </div>

                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
