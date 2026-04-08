import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

const sections = [
  {
    title: "1. Problem Statement",
    content:
      "Digital eye strain is increasingly prevalent among students, developers, clinicians, and remote workers. Existing tools are mostly static timer-based reminders that ignore individualized physiological responses and temporal fatigue dynamics.",
  },
  {
    title: "2. Methodology",
    content:
      "Eye-Guard captures webcam video, extracts ocular biomarkers (EAR, blink rate, closure duration, gaze variance), and computes fatigue through both a weighted physiological score and temporal deep-learning models. We include adaptive baseline calibration per user.",
  },
  {
    title: "3. ML Pipeline",
    content:
      "The pipeline fuses four public datasets with real-world JisTech cohort sessions. Features are engineered in sliding windows, labels are generated through hybrid supervision (model + self-report), and an LSTM/GRU sequence classifier predicts fatigue levels (Normal/Mild/Moderate/Severe).",
  },
  {
    title: "4. Dataset Strategy",
    content:
      "We aggregate MRL Eye, Blink Detection, MRL+CEW, and Open/Closed datasets, then standardize metadata and class mappings. New participant sessions are appended as telemetry records, enabling continual learning and cross-domain robustness checks.",
  },
  {
    title: "5. Novelty Contribution",
    content:
      "First, personalized baseline adaptation reduces population-bias error. Second, temporal modeling captures fatigue progression missed by frame-level methods. Third, hybrid labeling uses AI confidence + human self-report to construct richer ground truth.",
  },
  {
    title: "6. Results",
    content:
      "Evaluation includes confusion matrix, precision, recall, F1-score, and 5-fold cross-validation. We benchmark against EAR-threshold heuristics and CNN baseline models, and map improvements against published ocular-fatigue studies.",
  },
  {
    title: "7. Future Work",
    content:
      "Next phases include multimodal fusion (posture, ambient light), uncertainty-aware calibration, federated personalization, and prospective clinical validation for occupational health deployment.",
  },
];

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Eye-Guard <span className="gradient-text">Research Documentation</span>
          </h1>
          <p className="mt-4 text-muted">
            Conference-ready technical summary for methodology, novelty, evaluation, and deployment architecture.
          </p>

          <div className="mt-10 space-y-6">
            {sections.map((section) => (
              <section key={section.title} className="rounded-xl border border-card-border bg-card/40 p-6">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{section.content}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

