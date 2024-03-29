import numpy as np
from matplotlib import pyplot as plt
from matplotlib.cm import get_cmap
from mpl_toolkits.axes_grid1 import make_axes_locatable
import plotly.graph_objects as go
from . import base as utils
from .dose_tools import get_num_replicates
from pandas.core.series import Series


def get_extension(fname):
    if not "." in fname:
        return ""
    return fname.split(".")[-1]


def generate_heatmap_data(d1, d2, E, **kwargs):
    d1 = utils.remove_zeros(d1)
    d2 = utils.remove_zeros(d2)
    E = np.asarray(E)
    sorted_indices = np.lexsort((d1, d2))
    D1 = d1[sorted_indices]
    D2 = d2[sorted_indices]
    E = E[sorted_indices]
    # Replicates
    n_replicates = np.unique(get_num_replicates(d1, d2))
    if len(n_replicates) > 1:
        raise ValueError(
            "plot_heatmap() expects the same number of replicates for each dose"
        )
    n_replicates = n_replicates[0]
    if n_replicates != 1:
        aggfunc = kwargs.get("aggfunc", np.median)
        print(
            f"Number of replicates : {n_replicates}. aggregates the data using the {aggfunc.__name__}"
        )
        E_agg = []
        for e2 in np.unique(D2):
            for e1 in np.unique(D1):
                ix = (D1 == e1) & (D2 == e2)
                E_agg.append(aggfunc(E[ix]))
        E = np.array(E_agg)
        D1 = np.unique(D1)
        D2 = np.unique(D2)

    n_d1 = len(np.unique(D1))
    n_d2 = len(np.unique(D2))

    if len(d1) != n_d1 * n_d2 * n_replicates:
        raise ValueError("plot_heatmap() requires d1, d2 to represent a dose grid")
    E = E.reshape(n_d2, n_d1)
    return E.tolist()


def plot_heatmap(
    d1,
    d2,
    E,
    ax=None,
    fname=None,
    title="",
    xlabel="Drug 1",
    ylabel="Drug 2",
    figsize=None,
    cmap="GnBu",
    aspect="equal",
    vmin=None,
    vmax=None,
    center_on_zero=False,
    logscale=True,
    nancolor="#BBBBBB",
    **kwargs,
):
    if logscale:
        d1 = utils.remove_zeros(d1)
        d2 = utils.remove_zeros(d2)
    else:
        d1 = np.array(d1, copy=True)
        d2 = np.array(d2, copy=True)
    E = np.asarray(E)
    sorted_indices = np.lexsort((d1, d2))
    D1 = d1[sorted_indices]
    D2 = d2[sorted_indices]
    E = E[sorted_indices]
    # Replicates
    n_replicates = np.unique(get_num_replicates(d1, d2))
    if len(n_replicates) > 1:
        raise ValueError(
            "plot_heatmap() expects the same number of replicates for each dose"
        )
    n_replicates = n_replicates[0]
    if n_replicates != 1:
        aggfunc = kwargs.get("aggfunc", np.median)
        print(
            f"Number of replicates : {n_replicates}. plot_heatmap() aggregates the data using the {aggfunc.__name__}"
        )
        E_agg = []
        for e2 in np.unique(D2):
            for e1 in np.unique(D1):
                ix = (D1 == e1) & (D2 == e2)
                E_agg.append(aggfunc(E[ix]))
        E = np.array(E_agg)
        D1 = np.unique(D1)
        D2 = np.unique(D2)
        title += f"({aggfunc.__name__})"

    n_d1 = len(np.unique(D1))
    n_d2 = len(np.unique(D2))

    if len(d1) != n_d1 * n_d2 * n_replicates:
        raise ValueError("plot_heatmap() requires d1, d2 to represent a dose grid")
    created_ax = False
    if ax is None:
        fig, ax = plt.subplots(figsize=figsize)
        created_ax = True

    if center_on_zero:
        if vmin is None or vmax is None:
            zmax = max(abs(np.nanmin(E)), abs(np.nanmax(E)))
            vmin = -zmax
            vmax = zmax
        else:
            zmax = max(abs(vmin), abs(vmax))
            vmin = -zmax
            vmax = zmax

    current_cmap = get_cmap(name=cmap).copy()
    current_cmap.set_bad(color=nancolor)

    if not logscale:
        D1, D2 = np.meshgrid(D1, D2)
        # pco = ax.pcolormesh(D1.reshape(n_d2,n_d1), D2.reshape(n_d2, n_d1), E.reshape(n_d2, n_d1), vmin=vmin, vmax=vmax, cmap=cmap)
        pco = ax.pcolormesh(
            D1, D2, E.reshape(n_d2, n_d1), vmin=vmin, vmax=vmax, cmap=cmap
        )
    else:
        pco = ax.pcolormesh(E.reshape(n_d2, n_d1), cmap=cmap, vmin=vmin, vmax=vmax)
        relabel_log_ticks(ax, np.unique(D1), np.unique(D2))

    divider = make_axes_locatable(ax)
    cax = divider.append_axes("right", size=max(2 / n_d1, 2 / n_d2, 0.05), pad=0.1)
    plt.colorbar(pco, cax=cax)

    ax.set_aspect(aspect)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.set_title(title)
    plt.tight_layout()
    return fig


def square_log_axes(ax, nx, ny):
    """
    Transform log-scaled axes into a square aspect ratio.
    The axes will be resized so that each cell in the heatmap is square.
    TODO: This will work, but only if tight_layout() is not called
    """
    ratio = ny / nx

    pos1 = ax.get_position()

    fig_width = ax.get_figure().get_figwidth()
    fig_height = ax.get_figure().get_figheight()
    axratio = (fig_height * pos1.height) / (fig_width * pos1.width)

    pos2 = [pos1.x0, pos1.y0, pos1.width, pos1.height]

    if axratio > ratio:
        # decrease height
        target_height = ratio * fig_width * pos1.width / fig_height
        delta_height = pos1.height - target_height
        pos2[1] = pos2[1] - delta_height / 2.0  # Move y0 up by delta/2
        pos2[3] = target_height
        ax.set_position(pos2)

    elif axratio < ratio:
        # decrease width
        target_width = fig_height * pos1.height / (fig_width * ratio)
        # target_width = pos1.width/10
        delta_width = pos1.width - target_width
        pos2[0] = pos2[0] + delta_width / 2.0  # Move x0 right by delta/2
        pos2[2] = target_width
        # pos2 = [0,0,1,1]
        ax.set_position(pos2)


def relabel_log_ticks(d1, d2):
    """
    In plotting using pcolormesh(E), the x and y axes go from 0 to nx (or ny).
    This function replaces those with tick marks reflecting the true doses.
    Assumes both x and y axes come from log-scaled doses
    """
    nx = len(d1)
    ny = len(d2)
    tickdict = {}

    MIN_logx = np.log10(min(d1))
    MAX_logx = np.log10(max(d1))
    min_logx = int(np.ceil(np.log10(min(d1))))
    max_logx = int(np.floor(np.log10(max(d1))))

    MIN_logy = np.log10(min(d2))
    MAX_logy = np.log10(max(d2))
    min_logy = int(np.ceil(np.log10(min(d2))))
    max_logy = int(np.floor(np.log10(max(d2))))

    doses = np.arange(min_logx, max_logx + 1, 1)
    ticks = np.interp(doses, [MIN_logx, MAX_logx], [0.5, nx - 0.5])
    ticklabels = [r"$10^{{{}}}$".format(dose) for dose in doses]

    # ax.set_xticks(ticks)
    # ax.set_xticklabels(ticklabels)
    tickdict["xticks"] = ticks
    tickdict["xticklabels"] = ticklabels

    minor_ticks = []
    for i in range(min_logx - 1, max_logx + 1):
        for j in range(2, 10):
            minor_ticks.append(i + np.log10(j))
    minor_ticks = interp(minor_ticks, MIN_logx, MAX_logx, 0.5, nx - 0.5)
    minor_ticks = [i for i in minor_ticks if i > 0 and i < nx]

    # ax.set_xticks(minor_ticks, minor=True)
    tickdict["xminor_ticks"] = minor_ticks

    doses = np.arange(min_logy, max_logy + 1, 1)
    ticks = np.interp(doses, [MIN_logy, MAX_logy], [0.5, ny - 0.5])
    ticklabels = [r"$10^{{{}}}$".format(dose) for dose in doses]

    # ax.set_yticks(ticks)
    # ax.set_yticklabels(ticklabels)
    tickdict["yticks"] = ticks
    tickdict["yticklabels"] = ticklabels

    minor_ticks = []
    for i in range(min_logy - 1, max_logy + 1):
        for j in range(2, 10):
            minor_ticks.append(i + np.log10(j))
    minor_ticks = interp(minor_ticks, MIN_logy, MAX_logy, 0.5, ny - 0.5)
    minor_ticks = [i for i in minor_ticks if i > 0 and i < ny]

    # ax.set_yticks(minor_ticks, minor=True)
    tickdict["yminor_ticks"] = minor_ticks
    return tickdict


def interp(x, x0, x1, y0, y1):
    return (np.asarray(x) - x0) * (y1 - y0) / (x1 - x0) + y0


def antilog(val):
    return 10**val


def generate_3dsur_data(d1, d2, E, scatter_points, **kwargs):
    d1_conc = np.log10(d1[(d2 == 0) & (d1 != 0)])
    d1_effect = scatter_points["effect"][(d2 == 0) & (d1 != 0)]

    d2_conc = np.log10(d2[(d1 == 0) & (d2 != 0)])
    # d2_effect = E[(d1 == 0) & (d2 != 0)]
    d2_effect = scatter_points["effect"][(d1 == 0) & (d2 != 0)]

    d1 = np.array(d1, copy=True, dtype=np.float64)
    d2 = np.array(d2, copy=True, dtype=np.float64)
    # E = np.asarray(E)
    E = np.array(scatter_points["effect"], copy=True, dtype=np.float64)

    d1 = utils.remove_zeros(d1)
    d2 = utils.remove_zeros(d2)
    d1 = np.log10(d1)
    d2 = np.log10(d2)

    sorted_indices = np.lexsort((d1, d2))
    D1 = d1[sorted_indices]
    D2 = d2[sorted_indices]
    # if sort_indices:
    #     E = E[sorted_indices]

    # Replicates
    n_replicates = np.unique(get_num_replicates(D1, D2))
    if len(n_replicates) > 1:
        raise ValueError("Expects the same number of replicates for each dose")
    n_replicates = n_replicates[0]

    if n_replicates != 1:
        aggfunc = kwargs.get("aggfunc", np.median)
        print(
            f"Number of replicates : {n_replicates}. aggregates the data using the {aggfunc.__name__}"
        )
        E_agg = []
        for e2 in np.unique(D2):
            for e1 in np.unique(D1):
                ix = (D1 == e1) & (D2 == e2)
                E_agg.append(aggfunc(E[ix]))
        E = np.array(E_agg)
        D1 = np.unique(D1)
        D2 = np.unique(D2)

        d1, d2 = np.meshgrid(D1, D2)

        n_d1 = len(np.unique(D1))
        n_d2 = len(np.unique(D2))
        E = E.reshape(n_d2, n_d1)
    else:
        n_d1 = len(np.unique(d1))
        n_d2 = len(np.unique(d2))
        if n_d1 != n_d2:
            min_dim = min(n_d2, n_d1)
            n_d2 = max(n_d2, n_d1)
            n_d1 = min_dim
        d1 = d1.reshape(n_d2, n_d1)
        d2 = d2.reshape(n_d2, n_d1)
        E = E.reshape(n_d2, n_d1)

    D1_hm = np.apply_along_axis(func1d=antilog, axis=0, arr=D1)
    D2_hm = np.apply_along_axis(func1d=antilog, axis=0, arr=D2)
    tickdict = relabel_log_ticks(np.unique(D1_hm), np.unique(D2_hm))

    zmax = max(abs(np.nanmin(E[~np.isinf(E)])), abs(np.nanmax(E[~np.isinf(E)])))
    vmin = -zmax
    vmax = zmax

    d1scatter = np.array(scatter_points["drug1.conc"], copy=True, dtype=np.float64)
    d2scatter = np.array(scatter_points["drug2.conc"], copy=True, dtype=np.float64)

    zero_mask_1 = np.where(d1scatter <= 0)
    pos_mask_1 = np.where(d1scatter > 0)

    zero_mask_2 = np.where(d2scatter <= 0)
    pos_mask_2 = np.where(d2scatter > 0)

    d1scatter[zero_mask_1] = np.min(d1)
    d2scatter[zero_mask_2] = np.min(d2)
    d1scatter[pos_mask_1] = np.log10(d1scatter[pos_mask_1])
    d2scatter[pos_mask_2] = np.log10(d2scatter[pos_mask_2])

    # HSA single dose for both drugs (side line plots)

    # xmin drug 1; drug 2 is maximised
    x1_xmax = d1[-1].tolist()  # vary drug1
    y1_xmax = d2[-1].tolist()  # fixed max drug2
    z1_xmax = E[-1].tolist()

    x1_xmin = np.apply_along_axis(lambda x: x[-1], 1, d1)  # fixed min drug1
    y1_xmin = np.apply_along_axis(lambda x: x[-1], 1, d2)  # vary drug2
    z1_xmin = np.apply_along_axis(lambda x: x[-1], 1, E)

    # xmax drug 1 ; drug 2 minimised
    x2_xmax = np.apply_along_axis(lambda x: x[0], 1, d1)  # fixed max drug 2
    y2_xmax = np.apply_along_axis(lambda x: x[0], 1, d2)  # vary drug1
    # lower z values
    z2_xmax = np.apply_along_axis(lambda x: x[0], 1, E)

    x2_xmin = d1[0].tolist()  # min lowest values
    y2_xmin = d2[0].tolist()  # min lowest values
    z2_xmin = E[0].tolist()

    data = {
        "xs": d1scatter,
        "ys": d2scatter,
        "zs": scatter_points["effect"],
        "x": d1,
        "y": d2,
        "z": E,
        "vmin": vmin,
        "vmax": vmax,
        "d1_conc": d1_conc,
        "d2_conc": d2_conc,
        "d1_effect": d1_effect,
        "d2_effect": d2_effect,
        "x1_xmin": x1_xmin,
        "y1_xmin": y1_xmin,
        "z1_xmin": z1_xmin,
        "x2_xmin": x2_xmin,
        "y2_xmin": y2_xmin,
        "z2_xmin": z2_xmin,
        "x1_xmax": x1_xmax,
        "y1_xmax": y1_xmax,
        "z1_xmax": z1_xmax,
        "x2_xmax": x2_xmax,
        "y2_xmax": y2_xmax,
        "z2_xmax": z2_xmax,
    }

    data = {**data, **tickdict}

    for k in data.keys():
        if isinstance(data[k], np.ndarray):
            # built-in python fucntion, use to convert array/iterable obj to list
            data[k] = data[k].tolist()
        elif isinstance(data[k], Series):
            # not a built-in python function, use of pd to convert series to list
            data[k] = data[k].to_list()

    return data
