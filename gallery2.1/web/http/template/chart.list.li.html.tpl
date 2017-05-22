<li class="image {{liClassName}}" id="li-chart-{{id}}">
	<a class="grid">
		<figure class="effect-zoe" style="width: 250px; height: 240px;">
			<img alt="{{chartName}}" src="{{chartImagePath}}" data-value="{{chartName}}" data-id="{{id}}" data-is-form-sgis="{{chartIsfromSgis}}" data-is-third-charts="{{isThirdCharts}}" data-url="{{dataUrl}}" style="width: 250px; height: 240px;" />
			<figcaption class="figcaption">{{figcaption}}</figcaption>
		</figure>
	</a>
	<div class="grid-right">
		<div class="circular heart icon link list" data-variation="large" data-html="{{chartName}}" data-value="{{chartName}}">
			{{shortChartName}}
		</div>
		<p class="grid-right-memo">
			{{chartMemo}}
		</p>
		<p class="grid-right-attr">
			<span class="attr-first">所属分类：{{catalogName}}</span>|
			<span>创建者：{{userName}}</span>|
			<span>来自成果保存：{{chartIsfromSgisText}}</span>
			<br/>
			<span class="attr-first">创建时间：{{createTimeText}}</span>|
			<span>修改时间：{{modifyTimeText}}</span>
		</p>
	</div>
</li>