"""Build a .docx note in exactly the V12 format, using the V12 .docx as template.

Usage: python3 build_note.py source.md output.docx

Source syntax (one block per line):
  # Title                      -> title (17 pt, bold, 1F3A5F)
  _Byline_                     -> byline (8 pt, italic, grey)
  ## Section                   -> section heading with bottom rule
  - **Lead.** text             -> level-1 bullet (bold lead, 9 pt)
    - text                     -> level-2 bullet
  * text                       -> grey italic footnote line, indented
  ### Références               -> small bold heading (8 pt)
  anything else                -> body paragraph (9 pt)
Inline: **bold**, [link text](https://url) -> clickable Word hyperlink (blue, underlined).
"""
import re
import shutil
import sys
import zipfile
from xml.sax.saxutils import escape, quoteattr

import os
TEMPLATE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "note", "template-v12.docx")
FONT = '<w:rFonts w:ascii="Calibri" w:eastAsia="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>'


def run(text, bold=False, italic=False, color=None, size=18):
    rpr = FONT
    if bold:
        rpr += "<w:b/><w:bCs/>"
    if italic:
        rpr += "<w:i/><w:iCs/>"
    if color:
        rpr += f'<w:color w:val="{color}"/>'
    rpr += f'<w:sz w:val="{size}"/><w:szCs w:val="{size}"/>'
    return f'<w:r><w:rPr>{rpr}</w:rPr><w:t xml:space="preserve">{escape(text)}</w:t></w:r>'


LINKS = []  # (rId, url) collected while converting; written to document.xml.rels


def link(label, url, **kw):
    rid = f"rIdLink{len(LINKS) + 1}"
    LINKS.append((rid, url))
    r = run(label, bold=kw.get("bold", False), italic=kw.get("italic", False), color="1F5FBF", size=kw.get("size", 18))
    r = r.replace("</w:rPr>", '<w:u w:val="single"/></w:rPr>', 1)
    return f'<w:hyperlink r:id="{rid}" w:history="1">{r}</w:hyperlink>'


def inline(text, **kw):
    out = []
    for i, part in enumerate(re.split(r"\*\*(.+?)\*\*", text)):
        if not part:
            continue
        bold = (i % 2 == 1) or kw.get("bold", False)
        pieces = re.split(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", part)
        for j in range(0, len(pieces), 3):
            if pieces[j]:
                out.append(run(pieces[j], bold=bold, italic=kw.get("italic", False),
                               color=kw.get("color"), size=kw.get("size", 18)))
            if j + 2 < len(pieces):
                out.append(link(pieces[j + 1], pieces[j + 2], bold=bold, italic=kw.get("italic", False),
                                size=kw.get("size", 18)))
    return "".join(out)


def para(ppr, runs):
    return f"<w:p><w:pPr>{ppr}</w:pPr>{runs}</w:p>" if ppr else f"<w:p>{runs}</w:p>"


def bullet(level):
    return (f'<w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="{level}"/><w:numId w:val="2"/></w:numPr>'
            '<w:spacing w:after="10" w:line="226" w:lineRule="auto"/>')


def convert(src):
    body = []
    for raw in open(src, encoding="utf-8").read().splitlines():
        line = raw.rstrip()
        if not line.strip():
            continue
        if line.startswith("### "):
            body.append(para('<w:spacing w:before="60" w:after="10"/>',
                             run(line[4:], bold=True, color="1F3A5F", size=16)))
        elif line.startswith("## "):
            body.append(para('<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="1F3A5F"/></w:pBdr>'
                             '<w:spacing w:before="100" w:after="40"/>',
                             run(line[3:], bold=True, color="1F3A5F", size=21)))
        elif line.startswith("# "):
            body.append(para("", run(line[2:], bold=True, color="1F3A5F", size=34)))
        elif line.startswith("_") and line.endswith("_"):
            body.append(para('<w:spacing w:after="60"/>', run(line[1:-1], italic=True, color="595959", size=16)))
        elif line.startswith("    - ") or line.startswith("  - "):
            body.append(para(bullet(1), inline(line.strip()[2:])))
        elif line.startswith("- "):
            body.append(para(bullet(0), inline(line[2:])))
        elif line.startswith("* "):
            body.append(para('<w:spacing w:before="20" w:after="40"/><w:ind w:left="280"/>',
                             inline(line, italic=True, color="595959")))
        else:
            body.append(para('<w:spacing w:after="10"/>', inline(line)))
    return "".join(body)


def main(src, out):
    with zipfile.ZipFile(TEMPLATE) as z:
        xml = z.read("word/document.xml").decode("utf-8")
        items = {n: z.read(n) for n in z.namelist()}
    start = xml.index("<w:body>") + len("<w:body>")
    first_p_end = xml.index("</w:p>", start) + len("</w:p>")  # logo paragraph
    logo = xml[start:first_p_end]
    sect = xml[xml.index("<w:sectPr"):xml.index("</w:body>")]
    new = xml[:start] + logo + convert(src) + sect + xml[xml.index("</w:body>"):]
    items["word/document.xml"] = new.encode("utf-8")
    if LINKS:
        rels = items["word/_rels/document.xml.rels"].decode("utf-8")
        extra = "".join(f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target={quoteattr(url)} TargetMode="External"/>' for rid, url in LINKS)
        items["word/_rels/document.xml.rels"] = rels.replace("</Relationships>", extra + "</Relationships>").encode("utf-8")
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for n, data in items.items():
            z.writestr(n, data)
    print("ok", out)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
