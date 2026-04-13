# Feng BAO 鲍峰

I am a Principal Investigator at the [College for Future Information Technology](https://www.fudan.edu.cn/en/), [Fudan University](https://www.fudan.edu.cn/en/), Shanghai. My research develops statistical learning and AI methods to answer fundamental biological questions and advance medicine — spanning self-supervised representation learning, multi-modal information fusion, causal inference in complex biological systems, and deep generative models for spatial omics.

**Lab website:** [baolab-fudan.github.io](https://baolab-fudan.github.io/)

**We are looking for highly motivated PhD students and postdocs** with backgrounds in machine learning, statistics, bioinformatics, or biology.

Previously, I was a Postdoc (2019–2024) at [Altschuler and Wu Lab](https://www.altschulerwulab.org/), University of California, San Francisco, and a visiting scholar at [Dana-Farber Cancer Institute](https://www.dana-farber.org/), Harvard Medical School (2018–2019). I obtained my PhD from [Tsinghua University](https://www.tsinghua.edu.cn/en/) (2019), advised by Academician Qionghai Dai, and my B.Eng. from Xidian University (2014).

**Awards:** 2025 Xiaomi Young Scholar · 2023 National High-level Overseas Young Talent

```
Contact: fbao@fudan.edu.cn
```

---

## Research Interests

- **AI Methods**
  1. Self-supervised representation learning for biological data
  2. Multi-modal information fusion (transcriptomics, proteomics, spatial data, imaging)
  3. Causal inference in gene regulatory networks and drug perturbation experiments

- **Biomedical Applications**
  1. Quantify interactions across multiple omics types
  2. Improve throughput of spatially resolved transcriptomics statistically
  3. Causal drug target discovery and transferable prediction of small-molecule function

[Full publication list on Google Scholar](https://scholar.google.com/citations?user=I0mcA3MAAAAJ&hl=en)

---

## Selected Publications

### **Whole-body molecular and cellular mapping of the laboratory mouse**

A comprehensive whole-body atlas integrating molecular and cellular data across tissues in the laboratory mouse. Published in [*Cell*](https://doi.org/10.1016/j.cell.2026.03.006), 2026.

[\[Publication\]](https://doi.org/10.1016/j.cell.2026.03.006)
> Clevenger MH, Cipurko D, Patil A, Li B, Takahama M, Mei L, Plaster M, Kawamoto G, **Bao F**, Chevrier N, et al. Cell. 2026. https://doi.org/10.1016/j.cell.2026.03.006

---

### **Transitive prediction of small molecule function through alignment of high-content screening resources**

<img style="float: left; margin-right: 24px; margin-bottom: 8px;" src="/image/cover_clipn.jpg" width="190" />

High-content, image-based drug screening (HCS) is widely used in pharmaceutical research, but each institute develops its own pipeline — leaving studies isolated. We introduced the concept of integrated HCS drug screens and developed **CLIP<sup>n</sup>**, a contrastive learning framework that aligns heterogeneous datasets into a shared latent space to enable cross-dataset predictions, bridging studies performed over 20 years apart. Published in [*Nature Biotechnology*](https://doi.org/10.1038/s41587-025-02729-2), 2025.

[\[Project Page\]](https://github.com/AltschulerWu-Lab/CLIPn) [\[Publication\]](https://doi.org/10.1038/s41587-025-02729-2)
> **Bao F**, Li L, Hammerlindl H, Shen SQ, Hammerlindl S, Altschuler SJ<sup>#</sup>, Wu LF<sup>#</sup>. Nature Biotechnology. 2025. https://doi.org/10.1038/s41587-025-02729-2

---

### **Tissue characterization at enhanced resolution across spatial omics platforms with deep generative modeling**

Tissue images (e.g., H&E) are generated alongside spatial omics data but at far higher resolution. We exploit this by jointly modeling space, image, and omics through a deep generative framework to enhance spatial omics resolution across diverse platforms and emerging spatial multiomics technologies. Published in [*Nature Communications*](https://doi.org/10.1038/s41467-024-50837-5), 2024.

[\[Publication\]](https://doi.org/10.1038/s41467-024-50837-5)
> Li B, **Bao F**, Hou Y, Li F, Li H, Deng Y, Dai Q. Nature Communications 15:6541. 2024. https://doi.org/10.1038/s41467-024-50837-5

---

### **Multi-modality structured embedding for spatially resolved transcriptomics (MUSE)**

Transcriptomics and imaging are the two most widely used approaches to study tissue heterogeneity. **MUSE** combines information from both modalities while preserving structured information from each single modality and preventing corruption in one modality from polluting the other. Published in [*Nature Biotechnology*](https://doi.org/10.1038/s41587-022-01251-z), 2022.

[\[Project Page\]](https://github.com/AltschulerWu-Lab/MUSE) [\[Code\]](https://github.com/AltschulerWu-Lab/MUSE) [\[Publication\]](https://doi.org/10.1038/s41587-022-01251-z)
> **Bao F**<sup>\*</sup>, Deng Y<sup>\*</sup>, Wan S, Wang B, Dai Q<sup>#</sup>, Altschuler SJ<sup>#</sup>, Wu LF<sup>#</sup>. Nature Biotechnology. 2022. https://doi.org/10.1038/s41587-022-01251-z

---

### **Deep association kernel learning to explain genetic causality for complex diseases (DAK)**

<img style="float: left; margin-right: 24px; margin-bottom: 8px;" src="/image/cover.jpeg" width="190" />

Causal loci contribute to complex diseases in various ways. We developed a trainable framework to automatically detect associated genetic positions while providing statistical significance quantification. Published as a **cover paper** in [*Patterns*](https://doi.org/10.1016/j.patter.2020.100057) (Cell Press), 2020.

[\[Project Page\]](https://github.com/feng-bao-ucsf/DAK) [\[Code\]](https://github.com/feng-bao-ucsf/DAK) [\[Publication\]](https://doi.org/10.1016/j.patter.2020.100057)
> **Bao F**, Deng Y, Du M, Ren Z, Wan S, et al. Patterns 1.6:100057. 2020.

---

### **Recurrent neural network for single-cell RNA-seq imputation (scScope)**

<img style="float: left; margin-right: 24px; margin-bottom: 8px;" src="/image/scscope.png" width="460" />

scScope is a deep-learning approach that accurately and rapidly identifies cell-type composition and transcriptional state from noisy single-cell gene-expression profiles containing dropout events, scaling to millions of cells. Published in [*Nature Methods*](https://doi.org/10.1038/s41592-019-0353-7), 2019.

[\[Project Page\]](https://github.com/AltschulerWu-Lab/scScope) [\[Code\]](https://github.com/AltschulerWu-Lab/scScope) [\[Publication\]](https://doi.org/10.1038/s41592-019-0353-7)
> Deng Y<sup>\*</sup>, **Bao F**<sup>\*</sup>, Dai Q, Wu LF<sup>#</sup>, Altschuler SJ<sup>#</sup>. Nature Methods 16:311–314. 2019. https://doi.org/10.1038/s41592-019-0353-7

---

## Academic Service

Reviewer for:
- Cell · Nature Biotechnology · Nature Biomedical Engineering · Nature Communications
- Cell Systems · Genome Biology · Briefings in Bioinformatics
- IEEE Transactions on Neural Networks and Learning Systems · IEEE Transactions on Fuzzy Systems
- IEEE Journal of Selected Topics in Signal Processing

---

_Last update: April 2026_

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-102911962-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-102911962-1');
</script>
