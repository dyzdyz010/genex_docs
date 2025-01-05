defmodule Genex.Components.Basic do
  use Genex.Components

  attr(:link, :string, required: true)
  slot(:inner_block, required: true)

  def button(assigns) do
    ~H"""
    <a href={@link} class="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
      <%= render_slot(@inner_block) %>
    </a>
    """
  end
end
