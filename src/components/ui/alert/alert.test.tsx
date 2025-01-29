import React from "react";
import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "./alert";

describe("Alert", () => {
  it("renders with default variant", () => {
    render(<Alert>Test Alert</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
  });

  it("renders with destructive variant", () => {
    render(<Alert variant="destructive">Destructive Alert</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("border-destructive/50");
  });

  it("renders with custom className", () => {
    render(<Alert className="test-class">Custom Alert</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("test-class");
  });

  it("renders with title and description", () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert Description</AlertDescription>
      </Alert>,
    );

    expect(screen.getByText("Alert Title")).toBeInTheDocument();
    expect(screen.getByText("Alert Description")).toBeInTheDocument();
  });
});
