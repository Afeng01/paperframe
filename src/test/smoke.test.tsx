// @vitest-environment jsdom
import "@/test/setup";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("test harness", () => {
  it("renders React with jsdom and jest-dom matchers", () => {
    render(<div>ok</div>);

    expect(screen.getByText("ok")).toBeInTheDocument();
  });
});
