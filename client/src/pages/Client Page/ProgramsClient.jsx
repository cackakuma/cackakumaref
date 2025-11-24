import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ProgramsNav from "./Navbars/ProgramsNavbar";
import Header from "./Navbars/headerPages"; // added
import More from "./Programs/More";
import ProgramLayout from "./Programs/ProgramsLayout";
import { getPrograms } from "../services/AdminApi";
import { useLoading } from "../../context/LoadingContext";

const Programs = () => {
  const scrollContainerRef = useRef(null);
  const [programs, setPrograms] = useState([]);
  const [firstSlug, setFirstSlug] = useState(null);
  const { setLoading } = useLoading();
  const location = useLocation();

  // Scroll to start when route changes or component mounts
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [location.pathname]);

  const slugify = (title) =>
    (title || "program")
      .toLowerCase()
      .replace(/[^a-z0-9\s_-]/g, "")
      .trim()
      .replace(/\s+/g, "_");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const resp = await getPrograms();
        const items = Array.isArray(resp) ? resp : resp?.data || [];
        setPrograms(items);
        if (items.length > 0) {
          setFirstSlug(slugify(items[0].title));
        }
      } catch (e) {
        setPrograms([]);
        setFirstSlug(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setLoading]);

  const renderProgram = (p) => {
    const pics = Array.isArray(p.pics) ? p.pics : [];
    const leadImage = pics[0]?.link || "/images/displayerpic.png";
    const supportImage = pics[1]?.link || leadImage;
    const benefits = Array.isArray(p.programBenefits)
      ? p.programBenefits
          .map((b) => (typeof b === "string" ? b : b?.benefit || ""))
          .filter(Boolean)
      : [];
    const impacts = Array.isArray(p.communityImpact)
      ? p.communityImpact
          .map((ci) => ({ impact: ci?.impact || "", desc: ci?.details || "" }))
          .filter((x) => x.impact || x.desc)
      : [];
    const half = Math.ceil(pics.length / 2);
    const beneGridLeft = pics.slice(0, half).map((pic) => ({ url: pic.link }));
    const beneGridRight = pics.slice(half).map((pic) => ({ url: pic.link }));
    return (
      <div className="shrink-0 w-[100vw] snap-start">
        <ProgramLayout
          leadImage={leadImage}
          programName={p.title}
          programDesc={p.description}
          supportImage={supportImage}
          supportAuthor={p.faci_name || "CAC"}
          impacts={impacts}
          beneGridLeft={beneGridLeft}
          beneGridRight={beneGridRight}
          programIcon={null}
          programColor="blue"
          statistics={[]}
          benefits={benefits}
          testimonials={[]}
        />
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Mobile: show general hamburger / modal navbar */}

      <Header text="Programs" />

      {/* Programs navigation (keeps existing behaviour) */}
      <ProgramsNav />

      <div className="pt-28">
        <div ref={scrollContainerRef} className="snap-x snap-proximity">
          <Routes>
            <Route
              index
              element={<Navigate to={firstSlug || "more"} replace />}
            />
            {programs.map((p) => (
              <Route
                key={p._id}
                path={slugify(p.title)}
                element={renderProgram(p)}
              />
            ))}
            <Route
              path="more"
              element={
                <div className="shrink-0 w-[100vw] snap-start">
                  <More />
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Programs;