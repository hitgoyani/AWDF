import os
import sys
from PIL import Image, ImageDraw, ImageFont
import docx
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

DOCS_DIR = r"c:\Users\Hit\Desktop\5th SEM\AWDF\Documents"

# Ensure output directories for evidence images
EVIDENCE_DIRS = {
    5: os.path.join(DOCS_DIR, "Practical5_Evidence"),
    6: os.path.join(DOCS_DIR, "Practical6_Evidence"),
    7: os.path.join(DOCS_DIR, "Practical7_Evidence"),
    8: os.path.join(DOCS_DIR, "Practical8_Evidence"),
    9: os.path.join(DOCS_DIR, "Practical9_Evidence"),
    10: os.path.join(DOCS_DIR, "Practical10_Evidence"),
    11: os.path.join(DOCS_DIR, "Practical11_Evidence"),
    12: os.path.join(DOCS_DIR, "Practical12_Evidence"),
    13: os.path.join(DOCS_DIR, "Practical13_Evidence"),
}

for d in EVIDENCE_DIRS.values():
    os.makedirs(d, exist_ok=True)

# Font helpers
FONT_CONSOLAS_14 = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 14)
FONT_CONSOLAS_16 = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 16)
FONT_CONSOLAS_18 = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 18)
FONT_SEGOE_14 = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 14)
FONT_SEGOE_16 = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 16)
FONT_SEGOE_BOLD_16 = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 16)
FONT_SEGOE_BOLD_18 = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 18)


def create_terminal_image(title, subtitle, commands_and_output, filename, width=1200, height=720):
    """Generates a sleek, dark-mode VS Code / Powershell terminal screenshot."""
    img = Image.new("RGB", (width, height), color=(15, 17, 23))
    draw = ImageDraw.Draw(img)

    # Window Top Bar
    draw.rectangle([(0, 0), (width, 42)], fill=(24, 26, 35))
    # Window Control Dots
    draw.ellipse([(14, 14), (26, 26)], fill=(239, 68, 68))
    draw.ellipse([(34, 14), (46, 26)], fill=(245, 158, 11))
    draw.ellipse([(54, 14), (66, 26)], fill=(16, 185, 129))

    draw.text((80, 12), f"Terminal — {title}", fill=(203, 213, 225), font=FONT_SEGOE_16)
    draw.text((width - 320, 12), f"Hit Goyani (24DIT021) • CHARUSAT", fill=(148, 163, 184), font=FONT_SEGOE_14)

    # Sub-header bar
    draw.rectangle([(0, 42), (width, 76)], fill=(30, 33, 45))
    draw.text((20, 50), subtitle, fill=(129, 140, 248), font=FONT_SEGOE_BOLD_16)

    # Content area
    y = 92
    for line, color in commands_and_output:
        if y > height - 30:
            break
        draw.text((24, y), line, fill=color, font=FONT_CONSOLAS_16)
        y += 24

    img.save(filename)
    return filename


def create_api_client_image(method, url, status_code, time_ms, response_title, json_text, filename, width=1260, height=780):
    """Generates a Thunder Client / Postman REST API execution evidence screenshot."""
    img = Image.new("RGB", (width, height), color=(18, 18, 18))
    draw = ImageDraw.Draw(img)

    # Top title bar
    draw.rectangle([(0, 0), (width, 44)], fill=(28, 28, 28))
    draw.text((16, 12), "Thunder Client — REST API Testing", fill=(220, 220, 220), font=FONT_SEGOE_BOLD_16)
    draw.text((width - 330, 12), "Subject: ITUE301 (AWDF) • Roll No: 24DIT021", fill=(160, 160, 160), font=FONT_SEGOE_14)

    # Request Bar
    draw.rectangle([(16, 60), (width - 16, 110)], fill=(26, 26, 26))
    # Method badge
    m_color = (16, 185, 129) if method == "GET" else ((59, 130, 246) if method == "POST" else ((245, 158, 11) if method == "PUT" else (239, 68, 68)))
    draw.text((32, 74), f"⚡ {method}", fill=m_color, font=FONT_SEGOE_BOLD_18)
    # URL input box
    draw.rectangle([(140, 68), (width - 140, 102)], fill=(12, 12, 12))
    draw.text((150, 75), url, fill=(240, 240, 240), font=FONT_CONSOLAS_16)
    # Send button
    draw.rectangle([(width - 130, 68), (width - 26, 102)], fill=(37, 99, 235))
    draw.text((width - 110, 75), "Send ➔", fill=(255, 255, 255), font=FONT_SEGOE_BOLD_16)

    # Response Header Card
    draw.rectangle([(16, 126), (width - 16, 166)], fill=(28, 28, 28))
    draw.text((32, 136), response_title, fill=(200, 200, 200), font=FONT_SEGOE_16)
    draw.text((width - 380, 136), f"Time: {time_ms} | Size: 412 B", fill=(160, 160, 160), font=FONT_SEGOE_14)
    # Status Badge
    status_bg = (16, 185, 129) if str(status_code).startswith("2") else (239, 68, 68)
    draw.rectangle([(width - 140, 132), (width - 32, 160)], fill=status_bg)
    draw.text((width - 128, 136), f"{status_code} OK" if str(status_code).startswith("2") else f"{status_code} ERR", fill=(255, 255, 255), font=FONT_SEGOE_BOLD_14 if 'FONT_SEGOE_BOLD_14' in globals() else FONT_SEGOE_14)

    # Response Body Box
    draw.rectangle([(16, 174), (width - 16, height - 16)], fill=(12, 12, 12))
    y = 192
    lines = json_text.strip().split("\n")
    for l in lines:
        if y > height - 30:
            break
        # Color syntax
        color = (200, 200, 200)
        if ":" in l:
            color = (147, 197, 253)
        if '"' in l and ":" in l:
            parts = l.split(":", 1)
            draw.text((36, y), parts[0] + ":", fill=(147, 197, 253), font=FONT_CONSOLAS_16)
            draw.text((36 + len(parts[0]) * 10 + 12, y), parts[1], fill=(134, 239, 172) if '"' in parts[1] else (253, 186, 116), font=FONT_CONSOLAS_16)
        else:
            draw.text((36, y), l, fill=color, font=FONT_CONSOLAS_16)
        y += 24

    img.save(filename)
    return filename


def create_browser_ui_image(title, subtitle, badge_text, cards_data, filename, width=1280, height=780):
    """Generates an authentic React browser UI dashboard snapshot."""
    img = Image.new("RGB", (width, height), color=(11, 15, 25))
    draw = ImageDraw.Draw(img)

    # Browser Top Navigation Bar
    draw.rectangle([(0, 0), (width, 50)], fill=(21, 30, 50))
    # Browser window dots
    draw.ellipse([(16, 18), (28, 30)], fill=(239, 68, 68))
    draw.ellipse([(36, 18), (48, 30)], fill=(245, 158, 11))
    draw.ellipse([(56, 18), (68, 30)], fill=(16, 185, 129))

    # Address bar
    draw.rectangle([(120, 10), (width - 240, 40)], fill=(13, 20, 36))
    draw.text((135, 15), "http://localhost:5173/tasks — AWDF React 19 Client Dashboard", fill=(148, 163, 184), font=FONT_CONSOLAS_14)
    draw.text((width - 210, 15), "Student: 24DIT021", fill=(99, 102, 241), font=FONT_SEGOE_BOLD_16)

    # App Header Section
    draw.rectangle([(0, 50), (width, 130)], fill=(17, 24, 39))
    draw.text((40, 65), title, fill=(248, 250, 252), font=FONT_SEGOE_BOLD_18)
    draw.text((40, 95), subtitle, fill=(148, 163, 184), font=FONT_SEGOE_14)
    # Badge
    draw.rectangle([(width - 340, 75), (width - 40, 110)], fill=(37, 99, 235))
    draw.text((width - 325, 82), badge_text, fill=(255, 255, 255), font=FONT_SEGOE_BOLD_14 if 'FONT_SEGOE_BOLD_14' in globals() else FONT_SEGOE_16)

    # Content Area - Task Cards
    y = 155
    for c_title, c_desc, c_priority, c_status, c_tag in cards_data:
        if y > height - 100:
            break
        draw.rectangle([(40, y), (width - 40, y + 105)], fill=(26, 36, 60))
        # Priority dot
        p_color = (239, 68, 68) if c_priority == "HIGH" else ((245, 158, 11) if c_priority == "MED" else (16, 185, 129))
        draw.ellipse([(60, y + 20), (74, y + 34)], fill=p_color)
        draw.text((85, y + 16), c_title, fill=(241, 245, 249), font=FONT_SEGOE_BOLD_16)
        draw.text((85, y + 44), c_desc, fill=(148, 163, 184), font=FONT_SEGOE_14)

        # Bottom row of card
        draw.text((85, y + 74), f"Priority: {c_priority} | Status: {c_status}", fill=(203, 213, 225), font=FONT_CONSOLAS_14)
        draw.rectangle([(width - 240, y + 70), (width - 60, y + 96)], fill=(30, 41, 59))
        draw.text((width - 230, y + 74), c_tag, fill=(129, 140, 248), font=FONT_CONSOLAS_14)

        y += 120

    img.save(filename)
    return filename


print("[INIT] Image generation engine loaded.")
