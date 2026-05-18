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
                        <PageHeader
                            title={pageTitle}
                            subtitle={pageBreadcrumb}
                            actionLabel="Add Button"
                        />

                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
