'use client';

import { useEffect, useRef, useState } from 'react';
import type { GLViewer } from '3dmol';
import styles from './page.module.css';

const PDB_ID = '1OPJ';
const LIGAND_RESNAME = 'STI';

export default function Home() {
  const viewerRef = useRef<HTMLDivElement | null>(null);
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
          `https://files.rcsb.org/download/${PDB_ID}.pdb`,
        );

        if (!response.ok) {
          throw new Error(`Unable to fetch PDB ${PDB_ID}`);
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
          { resn: LIGAND_RESNAME },
          {
            stick: {
              color: '#f97316',
              radius: 0.35,
            },
            sphere: { color: '#fdba74', radius: 0.8 },
          },
        );
        viewer.addSurface(
          SurfaceType.VDW,
          { opacity: 0.35, color: '#f97316' },
          { resn: LIGAND_RESNAME },
        );
        viewer.zoomTo({ resn: LIGAND_RESNAME });
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
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Binder / Target</p>
        <h1>Imatinib bound to BCR-ABL (PDB {PDB_ID})</h1>
        <p className={styles.lede}>
          Protein is rendered as a single-color cartoon so the small-molecule
          binder imatinib ({LIGAND_RESNAME}) stands out in vivid orange. Drag to
          rotate, scroll or pinch to zoom.
        </p>
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
              aria-label="3D viewer for the imatinib complex"
            />
          </>
        )}
      </section>

      <section className={styles.detailsPanel}>
        <h2>What are we looking at?</h2>
        <ul>
          <li>
            <strong>Target:</strong> BCR-ABL tyrosine kinase catalytic domain,
            the oncogenic driver in chronic myeloid leukemia.
          </li>
          <li>
            <strong>Binder:</strong> Imatinib (residue code {LIGAND_RESNAME}), a
            first-in-class ATP-competitive inhibitor.
          </li>
          <li>
            <strong>Representation:</strong> Monochrome cartoon for the protein
            so the ligand pops in bright orange sticks/spheres, plus a
            translucent surface to emphasize the binding pocket.
          </li>
        </ul>
      </section>
    </main>
  );
}
