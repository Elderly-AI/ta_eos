package template

import (
	"fmt"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestKrTemplateUI_Parse(t *testing.T) {
	t.Run("should be ok on init value", func(t *testing.T) {
		facade := New()

		data := map[string]interface{}{
			"what_to_do":    "Первая контрольная работа",
			"template_name": "first",
			"UI": []interface{}{
				map[string]interface{}{
					"name": "table",
					"data": []interface{}{
						map[string]interface{}{
							"name": "Переменные",
							"data": []interface{}{
								map[string]interface{}{
									"name":  "A",
									"value": "A",
								},
								map[string]interface{}{
									"name":  "B",
									"value": "B",
								},
								map[string]interface{}{
									"name":  "-A",
									"value": "-A",
								},
								map[string]interface{}{
									"name":  "-B",
									"value": "-B",
								},
								map[string]interface{}{
									"name":     "A<<2",
									"value":    "A<<2",
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A>>3",
									"value":    "A>>3",
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A>>4",
									"value":    "A>>4",
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B<<2",
									"value":    "B<<2",
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B>>3",
									"value":    "B>>3",
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B>>4",
									"value":    "B>>4",
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A+B",
									"value":    "A+B",
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "-A+-B",
									"value":    "-A-B",
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "-A+B",
									"value":    "-A+B",
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A+-B",
									"value":    "A-B",
									"overflow": false,
								},
							},
						},
						map[string]interface{}{
							"name": "Значения",
							"data": []interface{}{
								map[string]interface{}{
									"name":  "A",
									"value": "60",
								},
								map[string]interface{}{
									"name":  "B",
									"value": "60",
								},
								map[string]interface{}{
									"name":  "-A",
									"value": "-60",
								},
								map[string]interface{}{
									"name":  "-B",
									"value": "-60",
								},
								map[string]interface{}{
									"name":     "A<<2",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A>>3",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A>>4",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B<<2",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B>>3",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B>>4",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A+B",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "-A+-B",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "-A+B",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A+-B",
									"value":    nil,
									"overflow": false,
								},
							},
						},
						map[string]interface{}{
							"name": "Прямой код",
							"data": []interface{}{
								map[string]interface{}{
									"name":  "A",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "B",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "-A",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "-B",
									"value": nil,
								},
								map[string]interface{}{
									"name":     "A<<2",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A>>3",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A>>4",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B<<2",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B>>3",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B>>4",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A+B",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "-A+-B",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "-A+B",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A+-B",
									"value":    nil,
									"overflow": false,
								},
							},
						},
						map[string]interface{}{
							"name": "Обратный код",
							"data": []interface{}{
								map[string]interface{}{
									"name":  "A",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "B",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "-A",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "-B",
									"value": nil,
								},
								map[string]interface{}{
									"name":     "A<<2",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A>>3",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A>>4",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B<<2",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B>>3",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B>>4",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A+B",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "-A+-B",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "-A+B",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A+-B",
									"value":    nil,
									"overflow": false,
								},
							},
						},
						map[string]interface{}{
							"name": "Дополнительный код",
							"data": []interface{}{
								map[string]interface{}{
									"name":  "A",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "B",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "-A",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "-B",
									"value": nil,
								},
								map[string]interface{}{
									"name":     "A<<2",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A>>3",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A>>4",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B<<2",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B>>3",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "B>>4",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A+B",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "-A+-B",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "-A+B",
									"value":    nil,
									"overflow": false,
								},
								map[string]interface{}{
									"name":     "A+-B",
									"value":    nil,
									"overflow": false,
								},
							},
						},
					},
				},
			},
		}

		data, points, err := facade.ApproveKr(data)
		require.NoError(t, err)
		fmt.Println(data, points)
	})
}
