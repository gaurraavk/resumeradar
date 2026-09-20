package com.resumeradar.dto;

public class FormattingWarning {

    private String issue;
    private String detail;

    public FormattingWarning() {}

    public FormattingWarning(String issue, String detail) {
        this.issue = issue;
        this.detail = detail;
    }

    public String getIssue() {
        return issue;
    }

    public void setIssue(String issue) {
        this.issue = issue;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }
}
