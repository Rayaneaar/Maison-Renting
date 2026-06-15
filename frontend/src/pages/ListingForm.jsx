import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import PillButton from "../components/ui/PillButton";
import UnderlineInput from "../components/ui/UnderlineInput";
import Spinner from "../components/ui/Spinner";

const STEPS = [
  { key: "title", label: "What is the name of this residence?" },
  { key: "type", label: "Is it for sale or for rent?" },
  { key: "price", label: "What is the asking price?" },
  { key: "details", label: "Tell us about the space." },
  { key: "location", label: "Where is it located?" },
  { key: "description", label: "Describe its character." },
  { key: "images", label: "Add the imagery." },
];

export default function ListingForm() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [form, setForm] = useState({
    title: "",
    type: "buy",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    address: "",
    city: "",
    latitude: "",
    longitude: "",
    description: "",
  });

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/properties/${slug}`)
      .then((res) => {
        const p = res.data.data;
        setForm({
          title: p.title,
          type: p.type,
          price: p.price,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          area: p.area,
          address: p.address,
          city: p.city,
          latitude: p.latitude ?? "",
          longitude: p.longitude ?? "",
          description: p.description,
        });
        setExistingImages(p.images || []);
      })
      .catch(() => setError("Could not load listing."))
      .finally(() => setLoading(false));
  }, [slug, isEdit]);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const addFiles = (list) => {
    const incoming = Array.from(list).filter((f) =>
      f.type.startsWith("image/")
    );
    setFiles((prev) => [...prev, ...incoming]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (i) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async () => {
    setError("");
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "" && v !== null) data.append(k, v);
      });
      files.forEach((f) => data.append("images[]", f));

      const url = isEdit ? `/properties/${slug}` : "/properties";
      await api.post(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/dashboard");
    } catch (err) {
      const res = err.response?.data;
      setError(
        res?.message ||
          (res?.errors ? Object.values(res.errors)[0][0] : "Failed to save.")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white text-black min-h-screen">
        <Navbar />
        <div className="pt-40">
          <Spinner label="Loading listing" />
        </div>
      </div>
    );
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="bg-white text-black min-h-screen">
      <Navbar />

      <div className="fixed top-[72px] inset-x-0 z-30 h-px bg-zinc-200">
        <div
          className="h-full bg-cyan transition-all duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="mx-auto max-w-3xl px-6 pt-40 pb-28 min-h-screen flex flex-col">
        <p className="text-[11px] uppercase tracking-[0.3em] text-cyan font-bold mb-6">
          {isEdit ? "Edit Residence" : "New Residence"} — {step + 1} /{" "}
          {STEPS.length}
        </p>

        <h1 className="font-serif text-5xl lg:text-6xl mb-14 leading-tight animate-fade-up">
          {current.label}
        </h1>

        {error && (
          <div className="mb-8 text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex-1 animate-fade-up" key={step}>
          {current.key === "title" && (
            <UnderlineInput
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. Villa Lumière"
              className="text-3xl"
              autoFocus
            />
          )}

          {current.key === "type" && (
            <div className="grid grid-cols-2 gap-6 max-w-lg">
              {[
                { v: "buy", l: "For Sale" },
                { v: "rent", l: "For Rent" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setForm((f) => ({ ...f, type: opt.v }))}
                  className={`py-10 rounded-sm border text-lg font-serif transition-all ${
                    form.type === opt.v
                      ? "border-cyan bg-cyan/10 text-cyan"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          )}

          {current.key === "price" && (
            <UnderlineInput
              type="number"
              value={form.price}
              onChange={set("price")}
              placeholder="0"
              className="text-3xl"
              autoFocus
            />
          )}

          {current.key === "details" && (
            <div className="grid sm:grid-cols-3 gap-10 max-w-xl">
              <UnderlineInput
                label="Bedrooms"
                type="number"
                value={form.bedrooms}
                onChange={set("bedrooms")}
                placeholder="0"
              />
              <UnderlineInput
                label="Bathrooms"
                type="number"
                value={form.bathrooms}
                onChange={set("bathrooms")}
                placeholder="0"
              />
              <UnderlineInput
                label="Area (m²)"
                type="number"
                value={form.area}
                onChange={set("area")}
                placeholder="0"
              />
            </div>
          )}

          {current.key === "location" && (
            <div className="space-y-10 max-w-xl">
              <UnderlineInput
                label="Address"
                value={form.address}
                onChange={set("address")}
                placeholder="Street, number"
              />
              <UnderlineInput
                label="City"
                value={form.city}
                onChange={set("city")}
                placeholder="e.g. Milan"
              />
              <div className="grid grid-cols-2 gap-8">
                <UnderlineInput
                  label="Latitude"
                  type="number"
                  value={form.latitude}
                  onChange={set("latitude")}
                  placeholder="45.4642"
                />
                <UnderlineInput
                  label="Longitude"
                  type="number"
                  value={form.longitude}
                  onChange={set("longitude")}
                  placeholder="9.1900"
                />
              </div>
            </div>
          )}

          {current.key === "description" && (
            <UnderlineInput
              as="textarea"
              rows={6}
              value={form.description}
              onChange={set("description")}
              placeholder="Describe the architecture, the light, the feeling of arrival…"
              className="text-xl leading-relaxed"
              autoFocus
            />
          )}

          {current.key === "images" && (
            <div>
              {existingImages.length > 0 && (
                <div className="mb-8">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-4">
                    Current Images
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {existingImages.map((img) => (
                      <div
                        key={img.id}
                        className="h-24 w-32 overflow-hidden rounded-sm border border-zinc-200"
                      >
                        <img
                          src={img.url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-sm flex flex-col items-center justify-center py-24 transition-all ${
                  dragOver
                    ? "border-cyan bg-cyan/5"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <p className="font-serif text-3xl mb-3 text-zinc-800">
                  Drag &amp; drop your images
                </p>
                <p className="text-zinc-500 text-sm uppercase tracking-[0.2em]">
                  or click to browse
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>

              {files.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-8">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="relative h-24 w-32 overflow-hidden rounded-sm border border-zinc-200 group"
                    >
                      <img
                        src={URL.createObjectURL(f)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(i);
                        }}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-16">
          <button
            onClick={prev}
            disabled={step === 0}
            className="text-[11px] uppercase tracking-[0.22em] text-zinc-500 hover:text-black disabled:opacity-30 transition-colors"
          >
            ← Back
          </button>

          {isLast ? (
            <PillButton
              variant="cyan"
              size="lg"
              onClick={submit}
              disabled={saving}
            >
              {saving ? "Saving…" : isEdit ? "Update Listing" : "Publish Listing"}
            </PillButton>
          ) : (
            <PillButton variant="solid" size="lg" onClick={next}>
              Continue →
            </PillButton>
          )}
        </div>
      </div>
    </div>
  );
}
