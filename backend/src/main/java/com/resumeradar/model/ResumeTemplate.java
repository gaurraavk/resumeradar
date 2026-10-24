package com.resumeradar.model;

import java.util.List;

public class ResumeTemplate {

    private String id;
    private String name;
    private String description;
    private String fontFamily;
    private String accentColorHex;
    private String nameAlignment; // "LEFT" or "CENTER"
    private String headingCase;   // "UPPER" or "TITLE"
    private boolean showDividerLine;
    private List<String> sectionOrder;

    public ResumeTemplate() {}

    public ResumeTemplate(String id,
                          String name,
                          String description,
                          String fontFamily,
                          String accentColorHex,
                          String nameAlignment,
                          String headingCase,
                          boolean showDividerLine,
                          List<String> sectionOrder) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.fontFamily = fontFamily;
        this.accentColorHex = accentColorHex;
        this.nameAlignment = nameAlignment;
        this.headingCase = headingCase;
        this.showDividerLine = showDividerLine;
        this.sectionOrder = sectionOrder;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFontFamily() {
        return fontFamily;
    }

    public void setFontFamily(String fontFamily) {
        this.fontFamily = fontFamily;
    }

    public String getAccentColorHex() {
        return accentColorHex;
    }

    public void setAccentColorHex(String accentColorHex) {
        this.accentColorHex = accentColorHex;
    }

    public String getNameAlignment() {
        return nameAlignment;
    }

    public void setNameAlignment(String nameAlignment) {
        this.nameAlignment = nameAlignment;
    }

    public String getHeadingCase() {
        return headingCase;
    }

    public void setHeadingCase(String headingCase) {
        this.headingCase = headingCase;
    }

    public boolean isShowDividerLine() {
        return showDividerLine;
    }

    public void setShowDividerLine(boolean showDividerLine) {
        this.showDividerLine = showDividerLine;
    }

    public List<String> getSectionOrder() {
        return sectionOrder;
    }

    public void setSectionOrder(List<String> sectionOrder) {
        this.sectionOrder = sectionOrder;
    }
}
