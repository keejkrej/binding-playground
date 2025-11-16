'use client';

import { useEffect, useRef, useState } from 'react';
import type { GLViewer, SelectionSpec } from '3dmol';
import styles from './page.module.css';

type Complex = {
  id: string;
  label: string;
  binder: string;
  target: string;
  ligandLabel: string;
  ligandSelection: SelectionSpec;
  summary: string;
  ligandStickColor: string;
  ligandSurfaceColor: string;
};

const COMPLEXES: Complex[] = [
  {
    id: '1OPJ',
    label: 'Imatinib • BCR-ABL',
    binder: 'Imatinib',
    target: 'BCR-ABL tyrosine kinase',
    ligandLabel: 'STI',
    ligandSelection: { resn: 'STI' },
    summary:
      'First-in-class ATP-competitive inhibitor that locks Abl in an inactive conformation for CML treatment.',
    ligandStickColor: '#f97316',
    ligandSurfaceColor: '#fb923c',
  },
  {
    id: '6LU7',
    label: 'N3 • SARS-CoV-2 Mpro',
    binder: 'N3 covalent inhibitor',
    target: 'SARS-CoV-2 main protease (Mpro)',
    ligandLabel: 'N3',
    ligandSelection: { resn: ['02J', 'PJE', '010'] },
    summary:
      'Electrophilic peptidomimetic that irreversibly binds the viral main protease and seeded COVID-era antiviral design.',
    ligandStickColor: '#f43f5e',
    ligandSurfaceColor: '#fb7185',
  },
  {
    id: '2RH1',
    label: 'Carazolol • β2AR',
    binder: 'Carazolol',
    target: 'β2 adrenergic receptor (GPCR)',
    ligandLabel: 'CAU',
    ligandSelection: { resn: 'CAU' },
    summary:
      'Inverse agonist that stabilizes the inactive β2AR state; the structure jump-started GPCR drug discovery.',
    ligandStickColor: '#a855f7',
    ligandSurfaceColor: '#c084fc',
  },
];

export default function Home() {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [selectedComplex, setSelectedComplex] = useState(COMPLEXES[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const element = viewerRef.current;
    if (!element) {
      return;
    }

    let cancelled = false;
    let viewer: GLViewer | null = null;

    const loadStructure = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://files.rcsb.org/download/${selectedComplex.id}.pdb`,
        );

        if (!response.ok) {
          throw new Error(`Unable to fetch PDB ${selectedComplex.id}`);
        }

        const pdbData = await response.text();
        if (cancelled) {
          return;
        }

        const { GLViewer, SurfaceType } = await import('3dmol');

        element.innerHTML = '';
        viewer = new GLViewer(element, {
          backgroundColor: '#050505',
          antialias: true,
        });

        viewer.addModel(pdbData, 'pdb');
        viewer.setStyle(
          { hetflag: false },
          { cartoon: { color: '#1f2937', opacity: 0.9 } },
        );
        viewer.setStyle(
          selectedComplex.ligandSelection,
          {
            stick: {
              color: selectedComplex.ligandStickColor,
              radius: 0.35,
            },
            sphere: { color: selectedComplex.ligandSurfaceColor, radius: 0.8 },
          },
        );
        viewer.addSurface(
          SurfaceType.VDW,
          { opacity: 0.35, color: selectedComplex.ligandSurfaceColor },
          selectedComplex.ligandSelection,
        );
        viewer.zoomTo(selectedComplex.ligandSelection);
        viewer.render();

        setIsLoading(false);
      } catch (err) {
        if (cancelled) {
          return;
        }

        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    loadStructure();

    return () => {
      cancelled = true;
      if (viewer) {
        viewer.clear();
      }
    };
  }, [selectedComplex]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Binder / Target</p>
        <h1>Binding Playground</h1>
        <p className={styles.lede}>
          Protein is rendered as a single-color cartoon so the small-molecule
          binder stands out in vivid color. Drag to rotate, scroll or pinch to
          zoom.
        </p>
        <div className={styles.selectorRow}>
          <label htmlFor="complex-select">Choose a complex</label>
          <select
            id="complex-select"
            className={styles.select}
            value={selectedComplex.id}
            onChange={(event) => {
              const next = COMPLEXES.find(
                (complex) => complex.id === event.target.value,
              );
              if (next) {
                setSelectedComplex(next);
              }
            }}
          >
            {COMPLEXES.map((complex) => (
              <option key={complex.id} value={complex.id}>
                {complex.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className={styles.viewerPanel}>
        {error ? (
          <div className={`${styles.status} ${styles.error}`}>
            <p>We ran into an issue loading the structure.</p>
            <code>{error}</code>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className={`${styles.status} ${styles.loading}`}>
                Loading structure from the PDB...
              </div>
            )}
            <div
              className={styles.viewer}
              ref={viewerRef}
              aria-label={`3D viewer for ${selectedComplex.binder} bound to ${selectedComplex.target}`}
            />
          </>
        )}
      </section>

      <section className={styles.detailsPanel}>
        <h2>What are we looking at?</h2>
        <ul>
          <li>
            <strong>Target:</strong> {selectedComplex.target}
          </li>
          <li>
            <strong>Binder:</strong> {selectedComplex.binder} (residue code{' '}
            {selectedComplex.ligandLabel})
          </li>
          <li>
            <strong>Why it matters:</strong> {selectedComplex.summary}
          </li>
          <li>
            <strong>Representation:</strong> Monochrome protein cartoon with a
            brightly hued ligand (sticks + spheres) and translucent surface to
            spotlight the binding pocket.
          </li>
        </ul>
      </section>
    </main>
  );
}
