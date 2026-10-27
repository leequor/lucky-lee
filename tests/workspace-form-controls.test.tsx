import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  CheckboxField,
  SelectField,
  TextAreaField,
} from "@/components/workspace/form-controls";

describe("workspace form controls", () => {
  it("renders a select with options", () => {
    render(
      <SelectField id="status" name="status" label="Status" defaultValue="open">
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </SelectField>,
    );
    expect(screen.getByLabelText("Status")).toHaveValue("open");
    expect(screen.getByRole("option", { name: "Closed" })).toBeInTheDocument();
  });

  it("renders a text area with a hint", async () => {
    const user = userEvent.setup();
    render(<TextAreaField id="note" name="note" label="Note" hint="Optional" />);
    const field = screen.getByLabelText("Note");
    await user.type(field, "Bench note");
    expect(field).toHaveValue("Bench note");
    expect(screen.getByText("Optional")).toBeInTheDocument();
  });

  it("renders a checkbox with description", () => {
    render(
      <CheckboxField
        id="visible"
        label="Customer visible"
        description="Show this note to the customer"
        defaultChecked
      />,
    );
    expect(screen.getByRole("checkbox", { name: /Customer visible/ })).toBeChecked();
    expect(screen.getByText("Show this note to the customer")).toBeInTheDocument();
  });
});
