defmodule Genex.Components.Basic do
  use Genex.Components

  attr(:link, :string, required: true)
  slot(:inner_block, required: true)

  def button(assigns) do
    ~H"""
    <a href={@link} class="button px-5 py-2 ns-glass rounded-lg level-medium ns-border">
      <%= render_slot(@inner_block) %>
    </a>
    """
  end

  attr(:links, :list, required: true)
  attr(:site, :map, required: true)

  def nav(assigns) do
    ~H"""
    <nav class="ns-glass border border-[var(--color-border)] level-low flex py-2 px-4 justify-start gap-16 items-center">
      <a href="/" class="link shadow-none text-xl font-bold">
        <%= @site.title %>
      </a>
      <div class="flex gap-8 shadow-none items-center">
        <a :for={{label, link} <- @links} href={link} class="link shadow-none">
          <%= label %>
        </a>
      </div>
    </nav>
    """
  end
end
