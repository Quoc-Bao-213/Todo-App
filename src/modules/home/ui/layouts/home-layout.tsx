import { HomeNavbar } from "../components/home-navbar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <HomeNavbar />
      <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
