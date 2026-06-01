from app.services.claude_service import parse_response


def test_parse_response_with_explanation():
    raw = "Hallo! Wie geht es dir? [EXPLAIN] 「Wie geht es dir?」は「元気ですか？」という意味。"
    result = parse_response(raw)
    assert result["message"] == "Hallo! Wie geht es dir?"
    assert result["explanation"] == "「Wie geht es dir?」は「元気ですか？」という意味。"


def test_parse_response_without_explanation():
    raw = "Das ist toll!"
    result = parse_response(raw)
    assert result["message"] == "Das ist toll!"
    assert result["explanation"] is None


def test_parse_response_empty_explanation():
    raw = "Ja! [EXPLAIN] "
    result = parse_response(raw)
    assert result["message"] == "Ja!"
    assert result["explanation"] == ""


def test_parse_response_multiline():
    raw = "Ich wohne in Berlin.\nDas ist eine schöne Stadt. [EXPLAIN] ベルリンはドイツの首都です。"
    result = parse_response(raw)
    assert result["message"] == "Ich wohne in Berlin.\nDas ist eine schöne Stadt."
    assert result["explanation"] == "ベルリンはドイツの首都です。"
